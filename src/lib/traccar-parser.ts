import type { PosicionGps } from "@/lib/gps-store";

/**
 * Parser de los formatos que envía Traccar Client.
 *
 * 1) Formato OsmAnd clásico (Traccar Client antiguo y la mayoría de apps):
 *    POST/GET ?id=XXX&timestamp=1700000000&lat=14.6&lon=-90.5&speed=0&bearing=0&altitude=0&accuracy=5&batt=80
 *    - speed viene en NUDOS.
 *
 * 2) Formato JSON (Traccar Client nuevo, v9+):
 *    {
 *      "device_id": "XXX",
 *      "location": {
 *        "timestamp": "2026-10-14T22:00:00.000Z",
 *        "coords": { "latitude": 14.6, "longitude": -90.5, "accuracy": 5, "speed": 0, "heading": 0, "altitude": 0 },
 *        "is_moving": false,
 *        "event": "motionchange",
 *        "battery": { "level": 0.8, "is_charging": false }
 *      }
 *    }
 *    - location puede ser un objeto o un arreglo (envíos en lote).
 *    - speed viene en m/s.
 */

type Registro = Record<string, unknown>;

const esObjeto = (valor: unknown): valor is Registro =>
  typeof valor === "object" && valor !== null && !Array.isArray(valor);

const aNumero = (valor: unknown): number | null => {
  if (valor === null || valor === undefined || valor === "") return null;
  const numero = typeof valor === "number" ? valor : Number(valor);
  return Number.isFinite(numero) ? numero : null;
};

const aBooleano = (valor: unknown): boolean | null => {
  if (typeof valor === "boolean") return valor;
  if (valor === "true" || valor === "1" || valor === 1) return true;
  if (valor === "false" || valor === "0" || valor === 0) return false;
  return null;
};

const aTexto = (valor: unknown): string | null => {
  if (valor === null || valor === undefined) return null;
  const texto = String(valor).trim();
  return texto.length > 0 ? texto : null;
};

const redondear = (valor: number | null, decimales = 1) =>
  valor === null ? null : Math.round(valor * 10 ** decimales) / 10 ** decimales;

const parsearTimestamp = (valor: unknown, recibidoEn: string): string => {
  if (valor === null || valor === undefined || valor === "") return recibidoEn;

  const numero = aNumero(valor);
  if (numero !== null) {
    // Epoch en segundos o milisegundos
    const ms = numero < 1e12 ? numero * 1000 : numero;
    const fecha = new Date(ms);
    return Number.isNaN(fecha.getTime()) ? recibidoEn : fecha.toISOString();
  }

  const fecha = new Date(String(valor));
  return Number.isNaN(fecha.getTime()) ? recibidoEn : fecha.toISOString();
};

const coordenadasValidas = (lat: number | null, lon: number | null) =>
  lat !== null && lon !== null && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180 && !(lat === 0 && lon === 0);

/** Formato OsmAnd plano: id, lat, lon, speed (nudos), batt (%) ... */
function parsearPlano(datos: Registro, recibidoEn: string): PosicionGps | null {
  const deviceId = aTexto(datos.id ?? datos.deviceid ?? datos.device_id);
  const latitud = aNumero(datos.lat ?? datos.latitude);
  const longitud = aNumero(datos.lon ?? datos.lng ?? datos.longitude);

  if (!deviceId || !coordenadasValidas(latitud, longitud)) return null;

  const velocidadNudos = aNumero(datos.speed);

  return {
    deviceId,
    latitud: latitud!,
    longitud: longitud!,
    precision: redondear(aNumero(datos.accuracy ?? datos.hdop)),
    velocidad: redondear(velocidadNudos === null ? null : velocidadNudos * 1.852),
    rumbo: redondear(aNumero(datos.bearing ?? datos.heading)),
    altitud: redondear(aNumero(datos.altitude)),
    bateria: redondear(aNumero(datos.batt ?? datos.battery), 0),
    cargando: aBooleano(datos.charge),
    enMovimiento: aBooleano(datos.motion),
    evento: aTexto(datos.alarm ?? datos.event),
    timestamp: parsearTimestamp(datos.timestamp, recibidoEn),
    recibidoEn,
  };
}

/** Formato JSON nuevo: { device_id, location: { coords, battery, ... } } */
function parsearUbicacionJson(
  ubicacion: Registro,
  deviceIdRaiz: string | null,
  recibidoEn: string,
): PosicionGps | null {
  const coords = esObjeto(ubicacion.coords) ? ubicacion.coords : null;
  if (!coords) return null;

  const extras = esObjeto(ubicacion.extras) ? ubicacion.extras : {};
  const deviceId =
    deviceIdRaiz ?? aTexto(ubicacion.device_id ?? extras.device_id ?? extras.id);
  const latitud = aNumero(coords.latitude);
  const longitud = aNumero(coords.longitude);

  if (!deviceId || !coordenadasValidas(latitud, longitud)) return null;

  const bateria = esObjeto(ubicacion.battery) ? ubicacion.battery : {};
  const nivelBateria = aNumero(bateria.level);
  const velocidadMs = aNumero(coords.speed);

  return {
    deviceId,
    latitud: latitud!,
    longitud: longitud!,
    precision: redondear(aNumero(coords.accuracy)),
    velocidad: redondear(velocidadMs === null || velocidadMs < 0 ? null : velocidadMs * 3.6),
    rumbo: redondear(aNumero(coords.heading)),
    altitud: redondear(aNumero(coords.altitude)),
    bateria: redondear(
      nivelBateria === null || nivelBateria < 0 ? null : nivelBateria <= 1 ? nivelBateria * 100 : nivelBateria,
      0,
    ),
    cargando: aBooleano(bateria.is_charging),
    enMovimiento: aBooleano(ubicacion.is_moving),
    evento: aTexto(ubicacion.event ?? extras.alarm),
    timestamp: parsearTimestamp(ubicacion.timestamp, recibidoEn),
    recibidoEn,
  };
}

/**
 * Recibe los parámetros de la URL y el cuerpo (ya decodificado) y devuelve
 * todas las posiciones válidas encontradas.
 */
export function parsearPosicionesTraccar(
  query: Registro,
  cuerpo: unknown,
  recibidoEn: string,
): PosicionGps[] {
  const posiciones: PosicionGps[] = [];

  if (esObjeto(cuerpo) && (cuerpo.location !== undefined || cuerpo.coords !== undefined)) {
    const deviceIdRaiz = aTexto(cuerpo.device_id ?? cuerpo.id ?? query.id ?? query.deviceid);
    const ubicaciones = cuerpo.location !== undefined ? cuerpo.location : cuerpo;
    const lista = Array.isArray(ubicaciones) ? ubicaciones : [ubicaciones];

    for (const ubicacion of lista) {
      if (!esObjeto(ubicacion)) continue;
      const posicion = parsearUbicacionJson(ubicacion, deviceIdRaiz, recibidoEn);
      if (posicion) posiciones.push(posicion);
    }

    return posiciones;
  }

  if (Array.isArray(cuerpo)) {
    for (const elemento of cuerpo) {
      if (!esObjeto(elemento)) continue;
      const posicion = parsearPlano({ ...query, ...elemento }, recibidoEn);
      if (posicion) posiciones.push(posicion);
    }
    return posiciones;
  }

  const combinado = { ...query, ...(esObjeto(cuerpo) ? cuerpo : {}) };
  const posicion = parsearPlano(combinado, recibidoEn);
  if (posicion) posiciones.push(posicion);

  return posiciones;
}
