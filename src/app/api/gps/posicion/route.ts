import { NextRequest, NextResponse } from "next/server";
import { obtenerUltimaPosicion } from "@/lib/gps-store";

export const dynamic = "force-dynamic";

const UMBRAL_ACTIVO_SEGUNDOS = 180; // 3 minutos

const HEADERS_SIN_CACHE = {
  "Cache-Control": "private, no-cache, no-store, max-age=0, must-revalidate",
  "CDN-Cache-Control": "no-store",
  "Cloudflare-CDN-Cache-Control": "no-store",
  Pragma: "no-cache",
  Expires: "0",
};

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
      { status: 400, headers: HEADERS_SIN_CACHE },
    );
  }

  const ultima = await obtenerUltimaPosicion(deviceId);

  if (!ultima) {
    return NextResponse.json(
      {
        encontrado: false,
        deviceId,
        posicion: null,
        mensaje: "No hay registros para este dispositivo",
      },
      { status: 200, headers: HEADERS_SIN_CACHE },
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
    { headers: HEADERS_SIN_CACHE },
  );
}
