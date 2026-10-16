import { NextRequest, NextResponse } from "next/server";
import { guardarPosicion, registrarSolicitud } from "@/lib/gps-store";
import { parsearPosicionesTraccar } from "@/lib/traccar-parser";

/**
 * Endpoint que recibe las ubicaciones de Traccar Client.
 * Configurar en la app:  URL del servidor = http://<IP-de-tu-PC>:3000/api/gps
 */

export const dynamic = "force-dynamic";

const MAX_CUERPO_LOG = 2000;

async function leerCuerpo(request: NextRequest): Promise<{ texto: string; datos: unknown }> {
  if (request.method === "GET" || request.method === "HEAD") {
    return { texto: "", datos: null };
  }

  const texto = await request.text();
  if (!texto.trim()) return { texto, datos: null };

  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json") || /^\s*[[{]/.test(texto)) {
    try {
      return { texto, datos: JSON.parse(texto) };
    } catch {
      // continúa e intenta como formulario
    }
  }

  const formulario = Object.fromEntries(new URLSearchParams(texto));
  return { texto, datos: formulario };
}

async function manejar(request: NextRequest) {
  const recibidoEn = new Date().toISOString();
  const query = Object.fromEntries(request.nextUrl.searchParams);

  let cuerpoTexto = "";
  let ok = false;
  let mensaje = "";
  let procesadas = 0;

  try {
    const { texto, datos } = await leerCuerpo(request);
    cuerpoTexto = texto;

    const posiciones = parsearPosicionesTraccar(query, datos, recibidoEn);
    posiciones.forEach(guardarPosicion);
    procesadas = posiciones.length;

    if (procesadas > 0) {
      ok = true;
      mensaje = `${procesadas} posición(es) guardada(s) para ${[...new Set(posiciones.map((p) => p.deviceId))].join(", ")}`;
    } else {
      mensaje = "No se encontró identificador de dispositivo o coordenadas válidas";
    }
  } catch (error) {
    mensaje = error instanceof Error ? error.message : "Error desconocido";
  }

  registrarSolicitud({
    recibidoEn,
    metodo: request.method,
    ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    userAgent: request.headers.get("user-agent"),
    contentType: request.headers.get("content-type"),
    query: request.nextUrl.search,
    cuerpo: cuerpoTexto.slice(0, MAX_CUERPO_LOG),
    ok,
    mensaje,
    posicionesProcesadas: procesadas,
  });

  console.log(`[GPS] ${request.method} ${ok ? "OK" : "RECHAZADO"} - ${mensaje}`);

  // Traccar Client solo necesita un 200 para dar el envío por exitoso.
  return new NextResponse(ok ? "OK" : mensaje, {
    status: ok ? 200 : 400,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export async function POST(request: NextRequest) {
  return manejar(request);
}

export async function GET(request: NextRequest) {
  return manejar(request);
}
