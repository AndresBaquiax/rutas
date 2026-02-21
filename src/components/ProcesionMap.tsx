"use client";

import { CircleMarker, MapContainer, Polyline, TileLayer, Tooltip } from "react-leaflet";

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
};

export default function ProcesionMap({
  coordenadas,
  primaryColor,
  vueltaColor,
  idaColor,
}: ProcesionMapProps) {
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
    </MapContainer>
  );
}
