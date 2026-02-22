import { NextRequest } from "next/server";
import { aplicarAjusteTiempo, obtenerAjusteTiempo } from "@/lib/procesionTiempoStore";

type AjusteTiempoBody = {
  tiempo?: string;
  procesionId?: string;
};

export async function GET(request: NextRequest) {
  const procesionId = request.nextUrl.searchParams.get("procesionId") ?? undefined;

  return Response.json(obtenerAjusteTiempo(procesionId));
}

export async function POST(request: NextRequest) {
  let body: AjusteTiempoBody;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      {
        error: "Body inválido. Debe enviarse JSON con { tiempo: '+5' } o { tiempo: '-5' }.",
      },
      { status: 400 },
    );
  }

  const tiempo = body.tiempo;

  if (!tiempo || !/^[+-]\d+$/.test(tiempo)) {
    return Response.json(
      {
        error: "'tiempo' es requerido y debe tener formato '+N' o '-N'.",
      },
      { status: 400 },
    );
  }

  const resultado = aplicarAjusteTiempo(tiempo, body.procesionId);

  if (!resultado) {
    return Response.json(
      {
        error: "No se pudo aplicar el ajuste de tiempo.",
      },
      { status: 400 },
    );
  }

  return Response.json(resultado);
}
