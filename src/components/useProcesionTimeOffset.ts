"use client";

import { useEffect, useState } from "react";

type AjusteTiempoResponse = {
  offsetMinutos?: number;
};

export default function useProcesionTimeOffset(procesionId: string) {
  const [offsetMinutos, setOffsetMinutos] = useState(0);

  useEffect(() => {
    let cancelado = false;

    const cargarOffset = async () => {
      try {
        const respuesta = await fetch(
          `/api/ajuste-tiempo?procesionId=${encodeURIComponent(procesionId)}`,
          { cache: "no-store" },
        );

        if (!respuesta.ok) {
          return;
        }

        const data = (await respuesta.json()) as AjusteTiempoResponse;
        const offset = Number(data.offsetMinutos);

        if (!cancelado && Number.isFinite(offset)) {
          setOffsetMinutos(offset);
        }
      } catch {
        // Sin acción: mantenemos el último offset válido
      }
    };

    void cargarOffset();

    const intervalo = window.setInterval(() => {
      void cargarOffset();
    }, 10_000);

    return () => {
      cancelado = true;
      window.clearInterval(intervalo);
    };
  }, [procesionId]);

  return offsetMinutos;
}
