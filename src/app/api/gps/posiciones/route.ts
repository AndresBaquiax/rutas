import os from "node:os";
import { NextRequest, NextResponse } from "next/server";
import {
  limpiarDatosGps,
  obtenerDispositivos,
  obtenerSolicitudes,
  obtenerUltimaPosicion,
} from "@/lib/gps-store";

/**
 * Consulta de posiciones recibidas.
 * - GET /api/gps/posiciones?id=XYZ       -> Última posición ligera para un dispositivo (mapa de procesión)
 * - GET /api/gps/posiciones              -> Todos los dispositivos, historiales y logs (panel de administración)
 * - DELETE /api/gps/posiciones           -> Limpia todo
 */

export const dynamic = "force-dynamic";

const UMBRAL_ACTIVO_SEGUNDOS = 180; // 3 minutos

const obtenerIpsLocales = () =>
  Object.values(os.networkInterfaces())
    .flat()
    .filter((red): red is os.NetworkInterfaceInfo => !!red && red.family === "IPv4" && !red.internal)
    .map((red) => red.address);

const HEADERS_SIN_CACHE = {
  "Cache-Control": "private, no-cache, no-store, max-age=0, must-revalidate",
  "CDN-Cache-Control": "no-store",
  "Cloudflare-CDN-Cache-Control": "no-store",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET(request: NextRequest) {
  const deviceId =
    request.nextUrl.searchParams.get("deviceId") ||
    request.nextUrl.searchParams.get("id");

  // Consulta ligera para un dispositivo específico (mapa del recorrido)
  if (deviceId) {
    const ultima = await obtenerUltimaPosicion(deviceId);

    if (!ultima) {
      return NextResponse.json(
        {
          encontrado: false,
          deviceId,
          posicion: null,
          mensaje: "No hay registros para este dispositivo",
        },
        {
          headers: HEADERS_SIN_CACHE,
        },
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
        altitud: ultima.altitud,
        bateria: ultima.bateria,
        cargando: ultima.cargando,
        enMovimiento: ultima.enMovimiento,
        recibidoEn: ultima.recibidoEn,
        timestamp: ultima.timestamp,
        segundosInactivo,
        activo,
      },
      {
        headers: HEADERS_SIN_CACHE,
      },
    );
  }

  // Consulta completa para el panel de pruebas
  const host = request.headers.get("host") ?? "";
  const puerto = host.includes(":") ? host.split(":").pop() : request.nextUrl.port || "3000";

  return NextResponse.json(
    {
      servidor: {
        horaServidor: new Date().toISOString(),
        ipsLocales: obtenerIpsLocales(),
        puerto,
      },
      dispositivos: await obtenerDispositivos(),
      solicitudes: await obtenerSolicitudes(),
    },
    {
      headers: HEADERS_SIN_CACHE,
    },
  );
}

export async function DELETE() {
  await limpiarDatosGps();
  return NextResponse.json({ ok: true });
}
