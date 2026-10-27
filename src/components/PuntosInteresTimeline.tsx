"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { MapPinIcon, ClockIcon } from "@heroicons/react/24/outline";
import { formatearHora12 } from "@/lib/date-format";

type PuntoInteres = {
  nombre: string;
  descripcion: string;
  hora?: string;
  ubicacion?: { latitud: number; longitud: number }[];
};

type PuntosInteresTimelineProps = {
  puntos: PuntoInteres[];
  fecha: string;
  primaryColor: string;
  neutralColor: string;
  thirdColor: string;
  onPuntoClick?: (coordenada: { latitud: number; longitud: number }) => void;
  puntoSeleccionado?: { latitud: number; longitud: number } | null;
};

const parseFechaHora = (fecha: string, hora?: string) => {
  if (
    !hora ||
    !/^\d{4}-\d{2}-\d{2}$/.test(fecha) ||
    !/^\d{2}:\d{2}$/.test(hora)
  ) {
    return null;
  }

  const fechaHora = new Date(`${fecha}T${hora}:00`);

  if (Number.isNaN(fechaHora.getTime())) {
    return null;
  }

  return fechaHora;
};

export default function PuntosInteresTimeline({
  puntos,
  fecha,
  primaryColor,
  neutralColor,
  thirdColor,
  onPuntoClick,
  puntoSeleccionado,
}: PuntosInteresTimelineProps) {
  const [ahoraMs, setAhoraMs] = useState(0);

  useEffect(() => {
    const temporizadorInicial = window.setTimeout(() => {
      setAhoraMs(Date.now());
    }, 0);

    const intervalo = window.setInterval(() => {
      setAhoraMs(Date.now());
    }, 60_000);

    return () => {
      window.clearTimeout(temporizadorInicial);
      window.clearInterval(intervalo);
    };
  }, []);

  const indiceActivo = useMemo(() => {
    if (puntos.length === 0) {
      return -1;
    }

    const tiempos = puntos
      .map((punto, index) => ({
        index,
        fechaHora: parseFechaHora(fecha, punto.hora),
      }))
      .filter((item) => item.fechaHora !== null) as Array<{
      index: number;
      fechaHora: Date;
    }>;

    if (tiempos.length === 0) {
      return -1;
    }

    const ventanaMs = 15 * 60 * 1000;

    for (const item of tiempos) {
      const tiempoMs = item.fechaHora.getTime();
      const inicioVentana = tiempoMs - ventanaMs;
      const finVentana = tiempoMs + ventanaMs;

      if (ahoraMs >= inicioVentana && ahoraMs <= finVentana) {
        return item.index;
      }
    }

    const primer = tiempos[0];
    const ultimo = tiempos[tiempos.length - 1];

    if (ahoraMs < primer.fechaHora.getTime() - ventanaMs) {
      return -1;
    }

    if (ahoraMs > ultimo.fechaHora.getTime() + ventanaMs) {
      return -1;
    }

    for (const item of tiempos) {
      if (ahoraMs < item.fechaHora.getTime() - ventanaMs) {
        return item.index;
      }
    }

    return ultimo.index;
  }, [ahoraMs, fecha, puntos]);

  return (
    <div
      className="space-y-3 overflow-y-auto pr-2 flex-1 custom-scrollbar"
      style={{ "--scroll-thumb-color": thirdColor } as CSSProperties}
    >
      {puntos.map((punto, index) => {
        const activo = index === indiceActivo;
        const tieneUbicacion = Boolean(
          punto.ubicacion && punto.ubicacion.length > 0
        );
        const esSeleccionado = Boolean(
          tieneUbicacion &&
            puntoSeleccionado &&
            punto.ubicacion![0].latitud === puntoSeleccionado.latitud &&
            punto.ubicacion![0].longitud === puntoSeleccionado.longitud
        );

        return (
          <article
            key={`${punto.nombre}-${index}`}
            onClick={() => {
              if (tieneUbicacion && onPuntoClick) {
                onPuntoClick(punto.ubicacion![0]);
              }
            }}
            className={`relative pl-8 pr-4 py-3.5 rounded-2xl transition-all duration-300 group ${
              tieneUbicacion ? "cursor-pointer hover:-translate-y-0.5" : ""
            }`}
            style={{
              backgroundColor:
                activo || esSeleccionado
                  ? `${thirdColor}1F`
                  : `${primaryColor}66`,
              border: `1px solid ${
                activo || esSeleccionado
                  ? `${thirdColor}80`
                  : `${neutralColor}14`
              }`,
              boxShadow:
                activo || esSeleccionado
                  ? `0 8px 20px -6px ${thirdColor}33`
                  : "none",
            }}
          >
            {/* Diamond Timeline Node */}
            <span
              className="absolute left-2.5 top-5 h-2.5 w-2.5 rotate-45 transition-transform duration-300 group-hover:scale-125"
              style={{
                backgroundColor: thirdColor,
                boxShadow:
                  activo || esSeleccionado ? `0 0 10px ${thirdColor}` : "none",
              }}
            />

            {/* Connecting Vertical Line */}
            {index < puntos.length - 1 && (
              <span
                className="absolute left-[14px] top-8 h-[calc(100%+4px)] w-[1.5px]"
                style={{ backgroundColor: `${thirdColor}40` }}
              />
            )}

            <div className="flex items-start justify-between gap-2.5 mb-1.5">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-[10px] font-mono uppercase tracking-widest opacity-70"
                    style={{ color: thirdColor }}
                  >
                    Punto {String(index + 1).padStart(2, "0")}
                  </span>
                  {activo && (
                    <span
                      className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full animate-pulse"
                      style={{
                        backgroundColor: thirdColor,
                        color: primaryColor,
                      }}
                    >
                      En curso
                    </span>
                  )}
                </div>

                <h3
                  className="font-serif font-bold text-lg sm:text-xl leading-snug break-words transition-colors"
                  style={{
                    color:
                      activo || esSeleccionado ? thirdColor : neutralColor,
                  }}
                >
                  {punto.nombre}
                </h3>
              </div>

              {punto.hora && (
                <span
                  className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 mt-0.5"
                  style={{
                    color: primaryColor,
                    backgroundColor: thirdColor,
                  }}
                >
                  <ClockIcon className="w-3.5 h-3.5" />
                  {formatearHora12(punto.hora)}
                </span>
              )}
            </div>

            <p
              className="text-xs sm:text-sm leading-relaxed"
              style={{ color: `${neutralColor}CC` }}
            >
              {punto.descripcion}
            </p>

            {tieneUbicacion && (
              <div
                className="mt-2.5 pt-2 border-t flex items-center justify-between text-[11px] uppercase tracking-wider font-semibold opacity-80 group-hover:opacity-100 transition-opacity"
                style={{
                  borderColor: `${neutralColor}12`,
                  color: thirdColor,
                }}
              >
                <span className="inline-flex items-center gap-1">
                  <MapPinIcon className="w-3.5 h-3.5" />
                  {esSeleccionado ? "Ubicado en el mapa" : "Ubicar en el mapa"}
                </span>
                <span>→</span>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
