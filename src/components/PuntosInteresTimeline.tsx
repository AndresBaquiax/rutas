"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

type PuntoInteres = {
  nombre: string;
  descripcion: string;
  hora: string;
};

type PuntosInteresTimelineProps = {
  puntos: PuntoInteres[];
  fecha: string;
  primaryColor: string;
  neutralColor: string;
  thirdColor: string;
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

const formatearHora = (hora: string) => {
  const coincidencia = hora.match(/^(\d{2}):(\d{2})$/);

  if (!coincidencia) {
    return hora;
  }

  const horas24 = Number(coincidencia[1]);
  const minutos = coincidencia[2];
  const esPm = horas24 >= 12;
  const horas12 = horas24 % 12 === 0 ? 12 : horas24 % 12;
  const sufijo = esPm ? "p. m." : "a. m.";

  return `${String(horas12).padStart(2, "0")}:${minutos} ${sufijo}`;
};

export default function PuntosInteresTimeline({
  puntos,
  fecha,
  primaryColor,
  neutralColor,
  thirdColor,
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
      .map((punto, index) => ({ index, fechaHora: parseFechaHora(fecha, punto.hora) }))
      .filter((item) => item.fechaHora !== null) as Array<{ index: number; fechaHora: Date }>;

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
      className="space-y-6 overflow-y-auto pr-2 flex-1 custom-scrollbar"
      style={{ "--scroll-thumb-color": thirdColor } as CSSProperties}
    >
      {puntos.map((punto, index) => {
        const activo = index === indiceActivo;

        return (
          <article
            key={`${punto.nombre}-${index}`}
            className="relative pl-6 rounded-lg px-2 py-2 transition-colors"
            style={{
              backgroundColor: activo ? `${thirdColor}1F` : "transparent",
              border: `1px solid ${activo ? `${thirdColor}66` : "transparent"}`,
            }}
          >
            <span
              className="absolute left-0 top-4 h-3 w-3 rounded-full"
              style={{ backgroundColor: thirdColor }}
            />

            {index < puntos.length - 1 && (
              <span
                className="absolute left-[5px] top-7 h-[calc(100%+12px)] w-[2px]"
                style={{ backgroundColor: `${thirdColor}55` }}
              />
            )}

            <div className="flex items-start justify-between gap-3 mb-1">
              <h3
                className="font-serif text-2xl leading-tight"
                style={{ color: activo ? thirdColor : neutralColor }}
              >
                {punto.nombre}
              </h3>

              <span
                className="text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap"
                style={{
                  color: primaryColor,
                  backgroundColor: thirdColor,
                }}
              >
                {formatearHora(punto.hora)}
              </span>
            </div>

            <p className="text-sm leading-relaxed" style={{ color: `${neutralColor}C7` }}>
              {punto.descripcion}
            </p>
          </article>
        );
      })}
    </div>
  );
}
