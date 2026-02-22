"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { divIcon, type Marker as LeafletMarker } from "leaflet";
import { CircleMarker, MapContainer, Marker, Polyline, TileLayer, Tooltip } from "react-leaflet";
import useProcesionTimeOffset from "@/components/useProcesionTimeOffset";

type Coordenada = {
  latitud: number;
  longitud: number;
  regreso: boolean;
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
  procesionId?: string;
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

const calcularDistancia = (origen: [number, number], destino: [number, number]) => {
  const deltaLat = destino[0] - origen[0];
  const deltaLng = destino[1] - origen[1];

  return Math.hypot(deltaLat, deltaLng);
};

export default function ProcesionMap({
  coordenadas,
  primaryColor,
  vueltaColor,
  idaColor,
  fecha,
  horaSalida,
  horaEntrada,
  pinColor,
  procesionId = "default",
}: ProcesionMapProps) {
  const offsetMinutos = useProcesionTimeOffset(procesionId);

  const rutaIda = coordenadas
    .filter((coordenada) => !coordenada.regreso)
    .map((coordenada) => [coordenada.latitud, coordenada.longitud] as [number, number]);

  const rutaRegreso = coordenadas
    .filter((coordenada) => coordenada.regreso)
    .map((coordenada) => [coordenada.latitud, coordenada.longitud] as [number, number]);

  const todasLasCoordenadas = coordenadas.map((coordenada) => [
    coordenada.latitud,
    coordenada.longitud,
  ] as [number, number]);

  const puntoInicio = todasLasCoordenadas[0];
  const puntoFinal = todasLasCoordenadas[todasLasCoordenadas.length - 1];

  const salida = useMemo(() => parseFechaHora(fecha, horaSalida), [fecha, horaSalida]);
  const entrada = useMemo(() => parseFechaHora(fecha, horaEntrada), [fecha, horaEntrada]);

  const [ahoraMs, setAhoraMs] = useState(() => Date.now());
  const marcadorProcesionRef = useRef<LeafletMarker | null>(null);
  const posicionMarcadorActualRef = useRef<[number, number] | null>(null);
  const animacionMarcadorRef = useRef<number | null>(null);

  const ahoraAjustadaMs = useMemo(() => {
    return ahoraMs + offsetMinutos * 60_000;
  }, [ahoraMs, offsetMinutos]);

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
        todasLasCoordenadas[indice],
      );

      totalDistancia += distanciaSegmento;
      acumuladas.push(totalDistancia);
    }

    return {
      acumuladas,
      totalDistancia,
    };
  }, [todasLasCoordenadas]);

  const posicionProcesion = useMemo(() => {
    if (!puntoInicio || !puntoFinal) {
      return null;
    }

    if (!salida || !entrada || entrada.getTime() <= salida.getTime()) {
      return puntoInicio;
    }

    const inicioMs = salida.getTime();
    const finMs = entrada.getTime();

    if (ahoraAjustadaMs <= inicioMs) {
      return puntoInicio;
    }

    if (ahoraAjustadaMs >= finMs) {
      return puntoFinal;
    }

    if (rutaConDistancias.totalDistancia === 0 || rutaConDistancias.acumuladas.length === 0) {
      return puntoInicio;
    }

    const progreso = (ahoraAjustadaMs - inicioMs) / (finMs - inicioMs);
    const distanciaObjetivo = progreso * rutaConDistancias.totalDistancia;

    let indiceSegmento = rutaConDistancias.acumuladas.findIndex(
      (distanciaAcumulada) => distanciaAcumulada >= distanciaObjetivo,
    );

    if (indiceSegmento < 0) {
      indiceSegmento = rutaConDistancias.acumuladas.length - 1;
    }

    const distanciaAnterior = indiceSegmento === 0 ? 0 : rutaConDistancias.acumuladas[indiceSegmento - 1];
    const distanciaSegmento = rutaConDistancias.acumuladas[indiceSegmento] - distanciaAnterior;

    if (distanciaSegmento <= 0) {
      return todasLasCoordenadas[indiceSegmento] ?? puntoInicio;
    }

    const factorSegmento = (distanciaObjetivo - distanciaAnterior) / distanciaSegmento;
    const origen = todasLasCoordenadas[indiceSegmento];
    const destino = todasLasCoordenadas[indiceSegmento + 1] ?? puntoFinal;

    return [
      origen[0] + (destino[0] - origen[0]) * factorSegmento,
      origen[1] + (destino[1] - origen[1]) * factorSegmento,
    ] as [number, number];
  }, [
    ahoraAjustadaMs,
    entrada,
    puntoFinal,
    puntoInicio,
    rutaConDistancias.acumuladas,
    rutaConDistancias.totalDistancia,
    salida,
    todasLasCoordenadas,
  ]);

  const mostrarPinProcesion = useMemo(() => {
    if (!salida) {
      return true;
    }

    const ventanaMinutosMs = 15 * 60 * 1000;
    const quinceMinutosAntes = salida.getTime() - ventanaMinutosMs;

    if (entrada && entrada.getTime() > salida.getTime()) {
      const quinceMinutosDespues = entrada.getTime() + ventanaMinutosMs;

      return ahoraAjustadaMs >= quinceMinutosAntes && ahoraAjustadaMs <= quinceMinutosDespues;
    }

    return ahoraAjustadaMs >= quinceMinutosAntes;
  }, [ahoraAjustadaMs, entrada, salida]);

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
      const progresoLineal = Math.min((tiempoActual - inicioAnimacion) / duracionMs, 1);
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
  }, [idaColor, pinColor, primaryColor]);

  if (todasLasCoordenadas.length === 0) {
    return (
      <div
        className="h-full w-full rounded-2xl flex items-center justify-center text-sm"
        style={{ color: `${vueltaColor}CC`, backgroundColor: `${primaryColor}B3` }}
      >
        No hay coordenadas disponibles para mostrar el recorrido.
      </div>
    );
  }

  return (
    <MapContainer
      bounds={todasLasCoordenadas}
      scrollWheelZoom={false}
      className="h-full w-full rounded-2xl"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {rutaIda.length > 1 && (
        <Polyline positions={rutaIda} pathOptions={{ color: idaColor, weight: 5, opacity: 0.95 }} />
      )}

      {rutaRegreso.length > 1 && (
        <Polyline
          positions={rutaRegreso}
          pathOptions={{ color: vueltaColor, weight: 4, opacity: 0.85, dashArray: "10 8" }}
        />
      )}

      {puntoInicio && (
        <CircleMarker
          center={puntoInicio}
          radius={7}
          pathOptions={{ color: primaryColor, fillColor: idaColor, fillOpacity: 1, weight: 2 }}
        >
          <Tooltip direction="top">Salida</Tooltip>
        </CircleMarker>
      )}

      {puntoFinal && (
        <CircleMarker
          center={puntoFinal}
          radius={7}
          pathOptions={{ color: primaryColor, fillColor: vueltaColor, fillOpacity: 1, weight: 2 }}
        >
          <Tooltip direction="top">Entrada</Tooltip>
        </CircleMarker>
      )}

      {mostrarPinProcesion && posicionProcesion && (
        <Marker
          position={posicionMarcadorActualRef.current ?? posicionProcesion}
          icon={iconoMarcadorProcesion}
          ref={marcadorProcesionRef}
        >
          <Tooltip direction="top" offset={[0, -26]}>
            Procesión en recorrido
          </Tooltip>
        </Marker>
      )}
    </MapContainer>
  );
}
