"use client";

import { useEffect, useMemo, useRef } from "react";
import { divIcon } from "leaflet";
import { Circle, MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from "react-leaflet";
import type { PosicionGps } from "@/lib/gps-store";

type GpsMapaPruebasProps = {
  deviceId?: string;
  posicion: PosicionGps | null;
  historial: PosicionGps[];
  seguir: boolean;
  colorPrincipal: string;
  colorAcento: string;
  colorRastro: string;
};

const CENTRO_GUATEMALA: [number, number] = [14.6349, -90.5069];

function SeguirPosicion({
  posicion,
  seguir,
  deviceId,
}: {
  posicion: [number, number] | null;
  seguir: boolean;
  deviceId?: string;
}) {
  const map = useMap();
  const primeraVez = useRef(true);
  const prevDeviceIdRef = useRef<string | undefined>(deviceId);

  useEffect(() => {
    if (!posicion) return;

    if (prevDeviceIdRef.current !== deviceId) {
      prevDeviceIdRef.current = deviceId;
      map.flyTo(posicion, 17, { duration: 1.2 });
      return;
    }

    if (primeraVez.current) {
      primeraVez.current = false;
      map.flyTo(posicion, 17, { duration: 1.2 });
      return;
    }

    if (seguir) {
      map.panTo(posicion, { animate: true, duration: 0.8 });
    }
  }, [posicion, seguir, deviceId, map]);

  return null;
}

export default function GpsMapaPruebas({
  deviceId,
  posicion,
  historial,
  seguir,
  colorPrincipal,
  colorAcento,
  colorRastro,
}: GpsMapaPruebasProps) {
  const punto = useMemo<[number, number] | null>(
    () => (posicion ? [posicion.latitud, posicion.longitud] : null),
    [posicion],
  );

  const rastro = useMemo(
    () => historial.map((p) => [p.latitud, p.longitud] as [number, number]),
    [historial],
  );

  const icono = useMemo(
    () =>
      divIcon({
        className: "",
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        html: `
          <div class="gps-pulso" style="--gps-color:${colorAcento}">
            <span style="background:${colorAcento};border-color:${colorPrincipal}"></span>
          </div>
        `,
      }),
    [colorAcento, colorPrincipal],
  );

  return (
    <MapContainer center={punto ?? CENTRO_GUATEMALA} zoom={punto ? 17 : 13} className="h-full w-full rounded-2xl">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {rastro.length > 1 && (
        <Polyline positions={rastro} pathOptions={{ color: colorRastro, weight: 4, opacity: 0.85 }} />
      )}

      {punto && posicion?.precision && posicion.precision > 0 && (
        <Circle
          center={punto}
          radius={posicion.precision}
          pathOptions={{ color: colorAcento, fillColor: colorAcento, fillOpacity: 0.12, weight: 1 }}
        />
      )}

      {punto && (
        <Marker position={punto} icon={icono}>
          <Tooltip direction="top" offset={[0, -14]}>
            {posicion?.deviceId}
          </Tooltip>
        </Marker>
      )}

      <SeguirPosicion posicion={punto} seguir={seguir} deviceId={deviceId} />
    </MapContainer>
  );
}
