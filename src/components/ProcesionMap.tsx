"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { divIcon, type Marker as LeafletMarker } from "leaflet";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import { ajustarCoordenadaARuta } from "@/lib/geo-snapping";
import { formatearHora12 } from "@/lib/date-format";

type Coordenada = {
  latitud: number;
  longitud: number;
  regreso: boolean;
};

export type Cancion = {
  titulo: string;
  coordenada?:
    | { latitud: number; longitud: number }[]
    | { latitud: number; longitud: number };
};

export type PuntoInteresMapa = {
  nombre: string;
  descripcion: string;
  hora?: string;
  ubicacion?: { latitud: number; longitud: number }[];
};

const obtenerCoordenadaCancion = (
  coordenadaProp?:
    | { latitud: number; longitud: number }[]
    | { latitud: number; longitud: number }
): { latitud: number; longitud: number } | null => {
  if (!coordenadaProp) return null;
  if (Array.isArray(coordenadaProp) && coordenadaProp.length > 0) {
    return {
      latitud: Number(coordenadaProp[0].latitud),
      longitud: Number(coordenadaProp[0].longitud),
    };
  }
  if (
    typeof coordenadaProp === "object" &&
    coordenadaProp !== null &&
    "latitud" in coordenadaProp &&
    "longitud" in coordenadaProp
  ) {
    return {
      latitud: Number((coordenadaProp as { latitud: number }).latitud),
      longitud: Number((coordenadaProp as { longitud: number }).longitud),
    };
  }
  return null;
};

type ProcesionMapProps = {
  coordenadas: Coordenada[];
  primaryColor: string;
  vueltaColor: string;
  idaColor: string;
  fecha: string;
  horaSalida: string;
  horaEntrada: string;
  pinColor?: string;
  puntoInteresSeleccionado?: { latitud: number; longitud: number } | null;
  centrarTrigger?: number;
  imagenUrl?: string;
  identificadorDispositivo?: string;
  canciones?: Cancion[];
  puntosInteres?: PuntoInteresMapa[];
  neutralColor?: string;
  thirdColor?: string;
  onCancionActivaChange?: (
    cancion: Cancion | null,
    indice: number | null
  ) => void;
};

const parseFechaHora = (fecha: string, hora: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || !/^\d{2}:\d{2}$/.test(hora)) {
    return null;
  }

  const fechaHora = new Date(`${fecha}T${hora}:00`);

  if (Number.isNaN(fechaHora.getTime())) {
    return null;
  }

  return fechaHora;
};

const calcularDistancia = (
  origen: [number, number],
  destino: [number, number]
) => {
  const deltaLat = destino[0] - origen[0];
  const deltaLng = destino[1] - origen[1];

  return Math.hypot(deltaLat, deltaLng);
};

type FlechaDireccion = {
  posicion: [number, number];
  anguloGrados: number;
};

function calcularFlechasRuta(
  puntos: [number, number][],
  cantidadObjetivo = 8
): FlechaDireccion[] {
  if (puntos.length < 2) return [];

  const segmentos: {
    origen: [number, number];
    destino: [number, number];
    longitud: number;
    acumuladaAntes: number;
  }[] = [];

  let total = 0;
  for (let i = 0; i < puntos.length - 1; i++) {
    const origen = puntos[i];
    const destino = puntos[i + 1];
    const len = calcularDistancia(origen, destino);
    if (len > 1e-7) {
      segmentos.push({
        origen,
        destino,
        longitud: len,
        acumuladaAntes: total,
      });
      total += len;
    }
  }

  if (total <= 0 || segmentos.length === 0) return [];

  const flechas: FlechaDireccion[] = [];
  const paso = total / (cantidadObjetivo + 1);

  for (let k = 1; k <= cantidadObjetivo; k++) {
    const distObjetivo = paso * k;
    const seg =
      segmentos.find(
        (s) => s.acumuladaAntes + s.longitud >= distObjetivo
      ) ?? segmentos[segmentos.length - 1];

    const factor = Math.min(
      1,
      Math.max(0, (distObjetivo - seg.acumuladaAntes) / seg.longitud)
    );
    const lat = seg.origen[0] + (seg.destino[0] - seg.origen[0]) * factor;
    const lng = seg.origen[1] + (seg.destino[1] - seg.origen[1]) * factor;

    const dLat = seg.destino[0] - seg.origen[0];
    const dLng =
      (seg.destino[1] - seg.origen[1]) * Math.cos((lat * Math.PI) / 180);
    const anguloGrados = (Math.atan2(dLng, dLat) * 180) / Math.PI;

    flechas.push({
      posicion: [lat, lng],
      anguloGrados,
    });
  }

  return flechas;
}

function CentrarProcesionControl({
  trigger,
  posicion,
  autoCentrarGps,
}: {
  trigger: number;
  posicion: [number, number] | null;
  autoCentrarGps?: boolean;
}) {
  const map = useMap();
  const prevTrigger = useRef(0);
  const primeraVezGps = useRef(true);

  useEffect(() => {
    if (autoCentrarGps && posicion && primeraVezGps.current) {
      primeraVezGps.current = false;
      map.flyTo(posicion, 17, { animate: true, duration: 1.2 });
      return;
    }

    if (trigger > prevTrigger.current && posicion) {
      prevTrigger.current = trigger;
      map.flyTo(posicion, 18, { animate: true, duration: 1.5 });
    }
  }, [trigger, posicion, autoCentrarGps, map]);

  return null;
}

function PuntoSeleccionadoMarker({
  punto,
  color,
}: {
  punto?: { latitud: number; longitud: number } | null;
  color: string;
}) {
  const map = useMap();

  useEffect(() => {
    if (punto) {
      map.flyTo([punto.latitud, punto.longitud], 18, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [punto, map]);

  const icon = useMemo(() => {
    return divIcon({
      className: "",
      iconSize: [34, 44],
      iconAnchor: [17, 44],
      html: `
        <div style="display:flex;align-items:center;justify-content:center;width:34px;height:44px;filter:drop-shadow(0 4px 8px rgba(0,0,0,0.45));">
          <svg width="34" height="44" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 7.5 10 22 10 22s10-14.5 10-22c0-5.52-4.48-10-10-10zm0 13.5c-1.93 0-3.5-1.57-3.5-3.5S10.07 8.5 12 8.5s3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" fill="${color}" stroke="#FFFFFF" stroke-width="1.5"/>
          </svg>
        </div>
      `,
    });
  }, [color]);

  if (!punto) return null;

  return (
    <Marker
      position={[punto.latitud, punto.longitud]}
      icon={icon}
      zIndexOffset={900}
    >
      <Tooltip direction="top" offset={[0, -42]}>
        Punto seleccionado
      </Tooltip>
    </Marker>
  );
}

export default function ProcesionMap({
  coordenadas,
  primaryColor,
  vueltaColor,
  idaColor,
  fecha,
  horaSalida,
  horaEntrada,
  pinColor,
  puntoInteresSeleccionado,
  centrarTrigger = 0,
  imagenUrl,
  identificadorDispositivo,
  canciones,
  puntosInteres,
  neutralColor,
  thirdColor,
  onCancionActivaChange,
}: ProcesionMapProps) {
  const colorDorado = thirdColor ?? primaryColor;
  const colorBlanco = neutralColor ?? "#FFFFFF";

  const puntosIda = coordenadas
    .filter((coordenada) => !coordenada.regreso)
    .map(
      (coordenada) =>
        [coordenada.latitud, coordenada.longitud] as [number, number]
    );

  const rutaRegreso = coordenadas
    .filter((coordenada) => coordenada.regreso)
    .map(
      (coordenada) =>
        [coordenada.latitud, coordenada.longitud] as [number, number]
    );

  const rutaIda =
    puntosIda.length > 0 && rutaRegreso.length > 0
      ? [...puntosIda, rutaRegreso[0]]
      : puntosIda;

  const todasLasCoordenadas = coordenadas.map(
    (coordenada) =>
      [coordenada.latitud, coordenada.longitud] as [number, number]
  );

  const puntoInicio = todasLasCoordenadas[0];
  const puntoFinal = todasLasCoordenadas[todasLasCoordenadas.length - 1];

  const flechasIda = useMemo(
    () => calcularFlechasRuta(rutaIda, 7),
    [rutaIda]
  );
  const flechasRegreso = useMemo(
    () => calcularFlechasRuta(rutaRegreso, 5),
    [rutaRegreso]
  );

  const salida = useMemo(
    () => parseFechaHora(fecha, horaSalida),
    [fecha, horaSalida]
  );
  const entrada = useMemo(() => {
    const e = parseFechaHora(fecha, horaEntrada);
    if (e && salida && e.getTime() < salida.getTime()) {
      e.setDate(e.getDate() + 1);
    }
    return e;
  }, [fecha, horaEntrada, salida]);

  const [ahoraMs, setAhoraMs] = useState(() => Date.now());
  const marcadorProcesionRef = useRef<LeafletMarker | null>(null);
  const posicionMarcadorActualRef = useRef<[number, number] | null>(null);
  const animacionMarcadorRef = useRef<number | null>(null);

  // Consulta ligera de GPS en vivo
  const [gpsData, setGpsData] = useState<{
    latitud: number;
    longitud: number;
    precision: number | null;
    recibidoEn: string;
    segundosInactivo: number;
    activo: boolean;
  } | null>(null);

  const consultarGps = useCallback(async () => {
    if (!identificadorDispositivo) return;
    try {
      const res = await fetch(
        `/api/gps/posicion?id=${encodeURIComponent(identificadorDispositivo)}&_t=${Date.now()}`,
        {
          cache: "no-store",
        }
      );
      if (!res.ok) return;
      const data = await res.json();
      if (data.encontrado) {
        setGpsData(data);
      } else {
        setGpsData(null);
      }
    } catch {
      // En caso de corte o desconexión, se conserva el estado para evaluar expiración
    }
  }, [identificadorDispositivo]);

  useEffect(() => {
    if (!identificadorDispositivo) return;

    consultarGps();
    const intervaloGps = window.setInterval(consultarGps, 10000);

    return () => {
      window.clearInterval(intervaloGps);
    };
  }, [identificadorDispositivo, consultarGps]);

  const usandoGps = useMemo(() => {
    if (!identificadorDispositivo || !gpsData) return false;
    const segundosInactivo = Math.max(
      0,
      (ahoraMs - new Date(gpsData.recibidoEn).getTime()) / 1000
    );
    return gpsData.activo && segundosInactivo <= 180;
  }, [identificadorDispositivo, gpsData, ahoraMs]);

  const posicionGpsAjustada = useMemo<[number, number] | null>(() => {
    if (!usandoGps || !gpsData) return null;
    const resultado = ajustarCoordenadaARuta(
      [gpsData.latitud, gpsData.longitud],
      coordenadas,
      35
    );
    return resultado
      ? resultado.posicionAjustada
      : [gpsData.latitud, gpsData.longitud];
  }, [usandoGps, gpsData, coordenadas]);

  useEffect(() => {
    const intervalo = window.setInterval(() => {
      setAhoraMs(Date.now());
    }, 250);

    return () => {
      window.clearInterval(intervalo);
    };
  }, []);

  const rutaConDistancias = useMemo(() => {
    if (todasLasCoordenadas.length < 2) {
      return {
        acumuladas: [] as number[],
        totalDistancia: 0,
      };
    }

    const acumuladas: number[] = [];
    let totalDistancia = 0;

    for (let indice = 1; indice < todasLasCoordenadas.length; indice += 1) {
      const distanciaSegmento = calcularDistancia(
        todasLasCoordenadas[indice - 1],
        todasLasCoordenadas[indice]
      );

      totalDistancia += distanciaSegmento;
      acumuladas.push(totalDistancia);
    }

    return {
      acumuladas,
      totalDistancia,
    };
  }, [todasLasCoordenadas]);

  const posicionProcesionPorHorario = useMemo(() => {
    if (!puntoInicio || !puntoFinal) {
      return null;
    }

    if (!salida || !entrada || entrada.getTime() <= salida.getTime()) {
      return puntoInicio;
    }

    const inicioMs = salida.getTime();
    const finMs = entrada.getTime();

    if (ahoraMs <= inicioMs) {
      return puntoInicio;
    }

    if (ahoraMs >= finMs) {
      return puntoFinal;
    }

    if (
      rutaConDistancias.totalDistancia === 0 ||
      rutaConDistancias.acumuladas.length === 0
    ) {
      return puntoInicio;
    }

    const progreso = (ahoraMs - inicioMs) / (finMs - inicioMs);
    const distanciaObjetivo = progreso * rutaConDistancias.totalDistancia;

    let indiceSegmento = rutaConDistancias.acumuladas.findIndex(
      (distanciaAcumulada) => distanciaAcumulada >= distanciaObjetivo
    );

    if (indiceSegmento < 0) {
      indiceSegmento = rutaConDistancias.acumuladas.length - 1;
    }

    const distanciaAnterior =
      indiceSegmento === 0
        ? 0
        : rutaConDistancias.acumuladas[indiceSegmento - 1];
    const distanciaSegmento =
      rutaConDistancias.acumuladas[indiceSegmento] - distanciaAnterior;

    if (distanciaSegmento <= 0) {
      return todasLasCoordenadas[indiceSegmento] ?? puntoInicio;
    }

    const factorSegmento =
      (distanciaObjetivo - distanciaAnterior) / distanciaSegmento;
    const origen = todasLasCoordenadas[indiceSegmento];
    const destino = todasLasCoordenadas[indiceSegmento + 1] ?? puntoFinal;

    return [
      origen[0] + (destino[0] - origen[0]) * factorSegmento,
      origen[1] + (destino[1] - origen[1]) * factorSegmento,
    ] as [number, number];
  }, [
    ahoraMs,
    entrada,
    puntoFinal,
    puntoInicio,
    rutaConDistancias.acumuladas,
    rutaConDistancias.totalDistancia,
    salida,
    todasLasCoordenadas,
  ]);

  const posicionProcesion = posicionGpsAjustada ?? posicionProcesionPorHorario;

  const mostrarPinProcesion = useMemo(() => {
    if (usandoGps) {
      return true;
    }

    if (!salida) {
      return true;
    }

    const ventanaMinutosMs = 15 * 60 * 1000;
    const quinceMinutosAntes = salida.getTime() - ventanaMinutosMs;

    if (entrada && entrada.getTime() > salida.getTime()) {
      const quinceMinutosDespues = entrada.getTime() + ventanaMinutosMs;

      return ahoraMs >= quinceMinutosAntes && ahoraMs <= quinceMinutosDespues;
    }

    return ahoraMs >= quinceMinutosAntes;
  }, [ahoraMs, entrada, salida, usandoGps]);

  const cancionesConDistancia = useMemo(() => {
    if (
      !canciones ||
      canciones.length === 0 ||
      !coordenadas ||
      coordenadas.length === 0
    ) {
      return [];
    }

    return canciones.map((cancion, idx) => {
      const coord = obtenerCoordenadaCancion(cancion.coordenada);
      if (!coord) {
        return { cancion, index: idx, distancia: 0 };
      }

      const ajuste = ajustarCoordenadaARuta(
        [coord.latitud, coord.longitud],
        coordenadas,
        500
      );
      if (!ajuste || rutaConDistancias.acumuladas.length === 0) {
        return {
          cancion,
          index: idx,
          distancia:
            (idx / Math.max(1, canciones.length)) *
            rutaConDistancias.totalDistancia,
        };
      }

      const i = ajuste.indiceSegmento;
      const distPrev = i === 0 ? 0 : (rutaConDistancias.acumuladas[i - 1] ?? 0);
      const distSeg = (rutaConDistancias.acumuladas[i] ?? distPrev) - distPrev;
      const distancia = distPrev + ajuste.factorSegmento * distSeg;

      return {
        cancion,
        index: idx,
        distancia,
      };
    });
  }, [canciones, coordenadas, rutaConDistancias]);

  const distanciaActualProcesion = useMemo(() => {
    if (rutaConDistancias.totalDistancia <= 0) return 0;

    if (usandoGps && gpsData) {
      const resultado = ajustarCoordenadaARuta(
        [gpsData.latitud, gpsData.longitud],
        coordenadas,
        35
      );
      if (resultado) {
        const i = resultado.indiceSegmento;
        const distPrev =
          i === 0 ? 0 : (rutaConDistancias.acumuladas[i - 1] ?? 0);
        const distSeg =
          (rutaConDistancias.acumuladas[i] ?? distPrev) - distPrev;
        return distPrev + resultado.factorSegmento * distSeg;
      }
    }

    if (!salida || !entrada || entrada.getTime() <= salida.getTime()) {
      return 0;
    }

    const inicioMs = salida.getTime();
    const finMs = entrada.getTime();

    if (ahoraMs <= inicioMs) return 0;
    if (ahoraMs >= finMs) return rutaConDistancias.totalDistancia;

    const progreso = (ahoraMs - inicioMs) / (finMs - inicioMs);
    return progreso * rutaConDistancias.totalDistancia;
  }, [
    ahoraMs,
    coordenadas,
    entrada,
    gpsData,
    rutaConDistancias,
    salida,
    usandoGps,
  ]);

  const cancionActivaInfo = useMemo(() => {
    if (!cancionesConDistancia || cancionesConDistancia.length === 0)
      return null;
    if (!mostrarPinProcesion) return null;

    let seleccionada = cancionesConDistancia[0];
    for (let i = 0; i < cancionesConDistancia.length; i++) {
      if (distanciaActualProcesion >= cancionesConDistancia[i].distancia) {
        seleccionada = cancionesConDistancia[i];
      } else {
        break;
      }
    }
    return seleccionada;
  }, [cancionesConDistancia, distanciaActualProcesion, mostrarPinProcesion]);

  useEffect(() => {
    if (onCancionActivaChange) {
      onCancionActivaChange(
        cancionActivaInfo ? cancionActivaInfo.cancion : null,
        cancionActivaInfo ? cancionActivaInfo.index : null
      );
    }
  }, [cancionActivaInfo, onCancionActivaChange]);

  useEffect(() => {
    if (!mostrarPinProcesion || !posicionProcesion) {
      if (animacionMarcadorRef.current !== null) {
        window.cancelAnimationFrame(animacionMarcadorRef.current);
        animacionMarcadorRef.current = null;
      }
      return;
    }

    const origen = posicionMarcadorActualRef.current ?? posicionProcesion;
    const destino = posicionProcesion;

    const deltaLatitud = destino[0] - origen[0];
    const deltaLongitud = destino[1] - origen[1];

    if (Math.abs(deltaLatitud) < 1e-9 && Math.abs(deltaLongitud) < 1e-9) {
      marcadorProcesionRef.current?.setLatLng(destino);
      posicionMarcadorActualRef.current = destino;
      return;
    }

    if (animacionMarcadorRef.current !== null) {
      window.cancelAnimationFrame(animacionMarcadorRef.current);
    }

    const duracionMs = 350;
    const inicioAnimacion = performance.now();

    const animar = (tiempoActual: number) => {
      const progresoLineal = Math.min(
        (tiempoActual - inicioAnimacion) / duracionMs,
        1
      );
      const progresoSuavizado = 0.5 - Math.cos(Math.PI * progresoLineal) / 2;

      const posicionInterpolada: [number, number] = [
        origen[0] + deltaLatitud * progresoSuavizado,
        origen[1] + deltaLongitud * progresoSuavizado,
      ];

      marcadorProcesionRef.current?.setLatLng(posicionInterpolada);
      posicionMarcadorActualRef.current = posicionInterpolada;

      if (progresoLineal < 1) {
        animacionMarcadorRef.current = window.requestAnimationFrame(animar);
      } else {
        animacionMarcadorRef.current = null;
      }
    };

    animacionMarcadorRef.current = window.requestAnimationFrame(animar);

    return () => {
      if (animacionMarcadorRef.current !== null) {
        window.cancelAnimationFrame(animacionMarcadorRef.current);
        animacionMarcadorRef.current = null;
      }
    };
  }, [mostrarPinProcesion, posicionProcesion]);

  const iconoMarcadorProcesion = useMemo(() => {
    const colorPin = pinColor ?? idaColor;

    if (imagenUrl) {
      return divIcon({
        className: "",
        iconSize: [52, 62],
        iconAnchor: [26, 62],
        html: `
          <div style="display:flex;flex-direction:column;align-items:center;width:52px;height:62px;">
            <div style="width:48px;height:48px;border-radius:50%;border:4px solid ${colorPin};overflow:hidden;background:${primaryColor};z-index:2;box-shadow:0 3px 6px rgba(0,0,0,0.3);flex-shrink:0;">
              <img src="${imagenUrl}" style="width:100%;height:100%;object-fit:cover;" alt="Procesión" onerror="this.style.display='none'" />
            </div>
            <div style="width:0;height:0;border-left:12px solid transparent;border-right:12px solid transparent;border-top:16px solid ${colorPin};margin-top:-2px;z-index:1;"></div>
          </div>
        `,
      });
    }

    return divIcon({
      className: "",
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      html: `
        <div style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 10C20 16 12 22 12 22C12 22 4 16 4 10C4 7.87827 4.84285 5.84344 6.34315 4.34315C7.84344 2.84285 9.87827 2 12 2C14.1217 2 16.1566 2.84285 17.6569 4.34315C19.1571 5.84344 20 7.87827 20 10Z" stroke="${colorPin}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="${colorPin}"/>
            <circle cx="12" cy="10" r="3" fill="${primaryColor}" />
          </svg>
        </div>
      `,
    });
  }, [idaColor, pinColor, primaryColor, imagenUrl]);

  // Puntos de interés con ubicación válida y su número original (1, 2, 3...)
  const puntosInteresConCoordenada = useMemo(() => {
    if (!puntosInteres) return [];
    return puntosInteres
      .map((p, index) => ({
        ...p,
        numero: index + 1,
        coordenada:
          p.ubicacion &&
          p.ubicacion.length > 0 &&
          typeof p.ubicacion[0].latitud === "number" &&
          typeof p.ubicacion[0].longitud === "number"
            ? ([p.ubicacion[0].latitud, p.ubicacion[0].longitud] as [
                number,
                number,
              ])
            : null,
      }))
      .filter(
        (
          item
        ): item is typeof item & { coordenada: [number, number] } =>
          item.coordenada !== null
      );
  }, [puntosInteres]);

  if (todasLasCoordenadas.length === 0) {
    return (
      <div
        className="h-full w-full rounded-2xl flex items-center justify-center text-sm"
        style={{
          color: `${vueltaColor}CC`,
          backgroundColor: `${primaryColor}B3`,
        }}
      >
        No hay coordenadas disponibles para mostrar el recorrido.
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <MapContainer
        bounds={todasLasCoordenadas}
        scrollWheelZoom={false}
        className="h-full w-full rounded-2xl"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Glow / Sombra suave para Recorrido de Ida */}
        {rutaIda.length > 1 && (
          <>
            <Polyline
              positions={rutaIda}
              pathOptions={{
                color: idaColor,
                weight: 14,
                opacity: 0.25,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
            <Polyline
              positions={rutaIda}
              pathOptions={{
                color: colorBlanco,
                weight: 8,
                opacity: 0.65,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
            <Polyline
              positions={rutaIda}
              pathOptions={{
                color: idaColor,
                weight: 5.5,
                opacity: 1,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
          </>
        )}

        {/* Glow / Sombra suave para Recorrido de Regreso */}
        {rutaRegreso.length > 1 && (
          <>
            <Polyline
              positions={rutaRegreso}
              pathOptions={{
                color: vueltaColor,
                weight: 13,
                opacity: 0.25,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
            <Polyline
              positions={rutaRegreso}
              pathOptions={{
                color: colorBlanco,
                weight: 7.5,
                opacity: 0.65,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
            <Polyline
              positions={rutaRegreso}
              pathOptions={{
                color: vueltaColor,
                weight: 4.5,
                opacity: 0.95,
                dashArray: "10 8",
                lineCap: "round",
                lineJoin: "round",
              }}
            />
          </>
        )}

        {/* Pequeñas flechas indicando la dirección del recorrido de Ida */}
        {flechasIda.map((f, idx) => (
          <Marker
            key={`flecha-ida-${idx}`}
            position={f.posicion}
            interactive={false}
            icon={divIcon({
              className: "",
              iconSize: [20, 20],
              iconAnchor: [10, 10],
              html: `
                <div style="width:20px;height:20px;display:flex;align-items:center;justify-content:center;transform:rotate(${f.anguloGrados}deg);filter:drop-shadow(0 1px 3px rgba(0,0,0,0.45));">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3L20 19L12 15L4 19L12 3Z" fill="${idaColor}" stroke="${colorBlanco}" stroke-width="2" stroke-linejoin="round"/>
                  </svg>
                </div>
              `,
            })}
          />
        ))}

        {/* Pequeñas flechas indicando la dirección del recorrido de Vuelta */}
        {flechasRegreso.map((f, idx) => (
          <Marker
            key={`flecha-regreso-${idx}`}
            position={f.posicion}
            interactive={false}
            icon={divIcon({
              className: "",
              iconSize: [20, 20],
              iconAnchor: [10, 10],
              html: `
                <div style="width:20px;height:20px;display:flex;align-items:center;justify-content:center;transform:rotate(${f.anguloGrados}deg);filter:drop-shadow(0 1px 3px rgba(0,0,0,0.45));">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3L20 19L12 15L4 19L12 3Z" fill="${vueltaColor}" stroke="${colorBlanco}" stroke-width="2" stroke-linejoin="round"/>
                  </svg>
                </div>
              `,
            })}
          />
        ))}

        {/* Círculos numerados para Puntos de Interés */}
        {puntosInteresConCoordenada.map((punto) => (
          <Marker
            key={`poi-${punto.numero}-${punto.nombre}`}
            position={punto.coordenada}
            zIndexOffset={400}
            icon={divIcon({
              className: "",
              iconSize: [26, 26],
              iconAnchor: [13, 13],
              html: `
                <div style="
                  width:26px;
                  height:26px;
                  border-radius:9999px;
                  background:${primaryColor};
                  border:2px solid ${colorDorado};
                  color:${colorDorado};
                  font-weight:800;
                  font-size:11px;
                  display:flex;
                  align-items:center;
                  justify-content:center;
                  box-shadow:0 3px 8px rgba(0,0,0,0.5), 0 0 0 2px ${primaryColor}80;
                ">
                  ${punto.numero}
                </div>
              `,
            })}
          >
            <Tooltip direction="top" offset={[0, -14]}>
              <span>
                {punto.numero}. {punto.nombre}
                {punto.hora ? ` (${formatearHora12(punto.hora)})` : ""}
              </span>
            </Tooltip>
          </Marker>
        ))}

        {puntoInicio && (
          <CircleMarker
            center={puntoInicio}
            radius={7}
            pathOptions={{
              color: primaryColor,
              fillColor: idaColor,
              fillOpacity: 1,
              weight: 2,
            }}
          >
            <Tooltip direction="top">Salida</Tooltip>
          </CircleMarker>
        )}

        {puntoFinal && (
          <CircleMarker
            center={puntoFinal}
            radius={7}
            pathOptions={{
              color: primaryColor,
              fillColor: vueltaColor,
              fillOpacity: 1,
              weight: 2,
            }}
          >
            <Tooltip direction="top">Entrada</Tooltip>
          </CircleMarker>
        )}

        {mostrarPinProcesion && posicionProcesion && (
          <Marker
            position={posicionMarcadorActualRef.current ?? posicionProcesion}
            icon={iconoMarcadorProcesion}
            ref={marcadorProcesionRef}
            zIndexOffset={700}
          >
            <Tooltip direction="top" offset={[0, -26]}>
              Procesión en recorrido
            </Tooltip>
          </Marker>
        )}

        <PuntoSeleccionadoMarker
          punto={puntoInteresSeleccionado}
          color={pinColor ?? idaColor}
        />
        <CentrarProcesionControl
          trigger={centrarTrigger}
          posicion={posicionMarcadorActualRef.current ?? posicionProcesion}
          autoCentrarGps={usandoGps}
        />
      </MapContainer>

      {/* Widget flotante Sonando ahora en la esquina superior derecha */}
      {cancionActivaInfo && (
        <div
          className="absolute top-3.5 right-3.5 z-[1000] flex items-center gap-2.5 px-3.5 py-2 rounded-xl shadow-2xl border backdrop-blur-md pointer-events-none select-none max-w-[85%] sm:max-w-[340px] transition-all duration-300"
          style={{
            backgroundColor: `${primaryColor}E6`,
            borderColor: `${colorBlanco}33`,
            color: colorBlanco,
          }}
        >
          <span className="text-base sm:text-lg animate-pulse flex-shrink-0">
            🎵
          </span>
          <div className="flex flex-col min-w-0">
            <span
              className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold leading-tight"
              style={{ color: colorDorado }}
            >
              Sonando ahora
            </span>
            <span className="text-xs sm:text-sm font-semibold truncate leading-tight mt-0.5">
              {cancionActivaInfo.cancion.titulo}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
