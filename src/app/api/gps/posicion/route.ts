import { NextRequest, NextResponse } from "next/server";
import { obtenerUltimaPosicion } from "@/lib/gps-store";

export const dynamic = "force-dynamic";

const UMBRAL_ACTIVO_SEGUNDOS = 180; // 3 minutos

/**
 * Endpoint ligero para obtener la última posición de un dispositivo GPS.
 * Uso: GET /api/gps/posicion?id=pruebas-localizacion
 */
export async function GET(request: NextRequest) {
  const deviceId =
    request.nextUrl.searchParams.get("id") ||
    request.nextUrl.searchParams.get("deviceId");

  if (!deviceId) {
    return NextResponse.json(
      { error: "Se requiere el parámetro 'id' del dispositivo" },
      { status: 400, headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  }

  const ultima = obtenerUltimaPosicion(deviceId);

  if (!ultima) {
    return NextResponse.json(
      {
        encontrado: false,
        deviceId,
        posicion: null,
        mensaje: "No hay registros para este dispositivo",
      },
      { status: 200, headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  }

  const ahora = Date.now();
  const recibidoMs = new Date(ultima.recibidoEn).getTime();
  const segundosInactivo = Math.max(0, Math.round((ahora - recibidoMs) / 1000));
  const activo = segundosInactivo <= UMBRAL_ACTIVO_SEGUNDOS;

  return NextResponse.json(
    {
      encontrado: true,
      deviceId,
      latitud: ultima.latitud,
      longitud: ultima.longitud,
      precision: ultima.precision,
      velocidad: ultima.velocidad,
      rumbo: ultima.rumbo,
      bateria: ultima.bateria,
      recibidoEn: ultima.recibidoEn,
      timestamp: ultima.timestamp,
      segundosInactivo,
      activo,
    },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
