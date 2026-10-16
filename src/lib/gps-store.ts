/**
 * Almacenamiento EN MEMORIA de posiciones GPS recibidas desde Traccar Client.
 *
 * Fase de pruebas: los datos se pierden al reiniciar el servidor y NO se comparten
 * entre instancias serverless (Vercel). Para producción se debe migrar a base de datos.
 */

export type PosicionGps = {
  deviceId: string;
  latitud: number;
  longitud: number;
  /** Precisión en metros */
  precision: number | null;
  /** Velocidad en km/h */
  velocidad: number | null;
  /** Rumbo en grados (0-360) */
  rumbo: number | null;
  altitud: number | null;
  /** Batería en porcentaje (0-100) */
  bateria: number | null;
  cargando: boolean | null;
  enMovimiento: boolean | null;
  evento: string | null;
  /** Momento en que el teléfono tomó la ubicación (ISO) */
  timestamp: string;
  /** Momento en que el servidor recibió la ubicación (ISO) */
  recibidoEn: string;
};

export type SolicitudGps = {
  recibidoEn: string;
  metodo: string;
  ip: string | null;
  userAgent: string | null;
  contentType: string | null;
  query: string;
  cuerpo: string;
  ok: boolean;
  mensaje: string;
  posicionesProcesadas: number;
};

export type DispositivoGps = {
  deviceId: string;
  ultima: PosicionGps;
  historial: PosicionGps[];
  totalRecibidas: number;
};

type GpsStore = {
  dispositivos: Map<string, DispositivoGps>;
  solicitudes: SolicitudGps[];
};

const MAX_HISTORIAL = 500;
const MAX_SOLICITUDES = 50;

// Se guarda en globalThis para sobrevivir al hot-reload de Next.js en desarrollo.
const globalGps = globalThis as unknown as { __gpsStore?: GpsStore };

const store: GpsStore =
  globalGps.__gpsStore ??
  (globalGps.__gpsStore = {
    dispositivos: new Map(),
    solicitudes: [],
  });

export function guardarPosicion(posicion: PosicionGps) {
  const existente = store.dispositivos.get(posicion.deviceId);

  if (!existente) {
    store.dispositivos.set(posicion.deviceId, {
      deviceId: posicion.deviceId,
      ultima: posicion,
      historial: [posicion],
      totalRecibidas: 1,
    });
    return;
  }

  existente.historial.push(posicion);
  existente.historial.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  if (existente.historial.length > MAX_HISTORIAL) {
    existente.historial.splice(0, existente.historial.length - MAX_HISTORIAL);
  }
  existente.ultima = existente.historial[existente.historial.length - 1];
  existente.totalRecibidas += 1;
}

export function registrarSolicitud(solicitud: SolicitudGps) {
  store.solicitudes.unshift(solicitud);
  if (store.solicitudes.length > MAX_SOLICITUDES) {
    store.solicitudes.length = MAX_SOLICITUDES;
  }
}

export function obtenerDispositivos(): DispositivoGps[] {
  return Array.from(store.dispositivos.values()).sort((a, b) =>
    b.ultima.recibidoEn.localeCompare(a.ultima.recibidoEn),
  );
}

export function obtenerUltimaPosicion(deviceId: string): PosicionGps | null {
  const dispositivo = store.dispositivos.get(deviceId);
  return dispositivo ? dispositivo.ultima : null;
}

export function obtenerSolicitudes(): SolicitudGps[] {
  return store.solicitudes;
}

export function limpiarDatosGps() {
  store.dispositivos.clear();
  store.solicitudes.length = 0;
}
