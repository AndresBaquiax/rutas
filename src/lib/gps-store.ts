import { prisma } from "@/lib/prisma";

export type PosicionGps = {
  deviceId: string;
  latitud: number;
  longitud: number;
  /** Precisión en metros */
  precision: number | null;
  /** Velocidad en km/h */
  velocidad: number | null;
  /** Rumbo en grados (0-360) */
  rumbo: number | null;
  altitud: number | null;
  /** Batería en porcentaje (0-100) */
  bateria: number | null;
  cargando: boolean | null;
  enMovimiento: boolean | null;
  evento: string | null;
  /** Momento en que el teléfono tomó la ubicación (ISO) */
  timestamp: string;
  /** Momento en que el servidor recibió la ubicación (ISO) */
  recibidoEn: string;
};

export type SolicitudGps = {
  recibidoEn: string;
  metodo: string;
  ip: string | null;
  userAgent: string | null;
  contentType: string | null;
  query: string;
  cuerpo: string;
  ok: boolean;
  mensaje: string;
  posicionesProcesadas: number;
};

export type DispositivoGps = {
  deviceId: string;
  ultima: PosicionGps;
  historial: PosicionGps[];
  totalRecibidas: number;
};

export async function guardarPosicion(posicion: PosicionGps): Promise<void> {
  const fechaRecibido = new Date(posicion.recibidoEn);
  const fechaTimestamp = new Date(posicion.timestamp);

  try {
    // 1. Guardar o actualizar la última posición en gps_dispositivo
    await prisma.gpsDispositivo.upsert({
      where: { deviceId: posicion.deviceId },
      create: {
        deviceId: posicion.deviceId,
        latitud: posicion.latitud,
        longitud: posicion.longitud,
        precision: posicion.precision,
        velocidad: posicion.velocidad,
        rumbo: posicion.rumbo,
        altitud: posicion.altitud,
        bateria: posicion.bateria,
        cargando: posicion.cargando,
        enMovimiento: posicion.enMovimiento,
        evento: posicion.evento,
        timestamp: fechaTimestamp,
        recibidoEn: fechaRecibido,
        totalRecibidas: 1,
      },
      update: {
        latitud: posicion.latitud,
        longitud: posicion.longitud,
        precision: posicion.precision,
        velocidad: posicion.velocidad,
        rumbo: posicion.rumbo,
        altitud: posicion.altitud,
        bateria: posicion.bateria,
        cargando: posicion.cargando,
        enMovimiento: posicion.enMovimiento,
        evento: posicion.evento,
        timestamp: fechaTimestamp,
        recibidoEn: fechaRecibido,
        totalRecibidas: { increment: 1 },
      },
    });

    // 2. Guardar en el historial de puntos recibidos
    await prisma.gpsHistorial.create({
      data: {
        deviceId: posicion.deviceId,
        latitud: posicion.latitud,
        longitud: posicion.longitud,
        precision: posicion.precision,
        velocidad: posicion.velocidad,
        rumbo: posicion.rumbo,
        altitud: posicion.altitud,
        bateria: posicion.bateria,
        cargando: posicion.cargando,
        enMovimiento: posicion.enMovimiento,
        evento: posicion.evento,
        timestamp: fechaTimestamp,
        recibidoEn: fechaRecibido,
      },
    });
  } catch (err) {
    console.error("[GPS Store] Error guardando posición en base de datos:", err);
  }
}

export async function registrarSolicitud(solicitud: SolicitudGps): Promise<void> {
  try {
    await prisma.gpsSolicitud.create({
      data: {
        recibidoEn: new Date(solicitud.recibidoEn),
        metodo: solicitud.metodo,
        ip: solicitud.ip,
        userAgent: solicitud.userAgent,
        contentType: solicitud.contentType,
        query: solicitud.query,
        cuerpo: solicitud.cuerpo,
        ok: solicitud.ok,
        mensaje: solicitud.mensaje,
        posicionesProcesadas: solicitud.posicionesProcesadas,
      },
    });
  } catch (err) {
    console.error("[GPS Store] Error registrando solicitud en base de datos:", err);
  }
}

export async function obtenerDispositivos(): Promise<DispositivoGps[]> {
  try {
    const dispositivos = await prisma.gpsDispositivo.findMany({
      orderBy: { recibidoEn: "desc" },
      include: {
        historial: {
          orderBy: { timestamp: "asc" },
          take: 500,
        },
      },
    });

    return dispositivos.map((disp) => ({
      deviceId: disp.deviceId,
      totalRecibidas: disp.totalRecibidas,
      ultima: {
        deviceId: disp.deviceId,
        latitud: disp.latitud,
        longitud: disp.longitud,
        precision: disp.precision,
        velocidad: disp.velocidad,
        rumbo: disp.rumbo,
        altitud: disp.altitud,
        bateria: disp.bateria,
        cargando: disp.cargando,
        enMovimiento: disp.enMovimiento,
        evento: disp.evento,
        timestamp: disp.timestamp.toISOString(),
        recibidoEn: disp.recibidoEn.toISOString(),
      },
      historial: disp.historial.map((h) => ({
        deviceId: h.deviceId,
        latitud: h.latitud,
        longitud: h.longitud,
        precision: h.precision,
        velocidad: h.velocidad,
        rumbo: h.rumbo,
        altitud: h.altitud,
        bateria: h.bateria,
        cargando: h.cargando,
        enMovimiento: h.enMovimiento,
        evento: h.evento,
        timestamp: h.timestamp.toISOString(),
        recibidoEn: h.recibidoEn.toISOString(),
      })),
    }));
  } catch (err) {
    console.error("[GPS Store] Error obteniendo dispositivos de base de datos:", err);
    return [];
  }
}

export async function obtenerUltimaPosicion(deviceId: string): Promise<PosicionGps | null> {
  try {
    const disp = await prisma.gpsDispositivo.findUnique({
      where: { deviceId },
    });

    if (!disp) return null;

    return {
      deviceId: disp.deviceId,
      latitud: disp.latitud,
      longitud: disp.longitud,
      precision: disp.precision,
      velocidad: disp.velocidad,
      rumbo: disp.rumbo,
      altitud: disp.altitud,
      bateria: disp.bateria,
      cargando: disp.cargando,
      enMovimiento: disp.enMovimiento,
      evento: disp.evento,
      timestamp: disp.timestamp.toISOString(),
      recibidoEn: disp.recibidoEn.toISOString(),
    };
  } catch (err) {
    console.error("[GPS Store] Error obteniendo última posición de base de datos:", err);
    return null;
  }
}

export async function obtenerSolicitudes(): Promise<SolicitudGps[]> {
  try {
    const solicitudes = await prisma.gpsSolicitud.findMany({
      orderBy: { recibidoEn: "desc" },
      take: 50,
    });

    return solicitudes.map((s) => ({
      recibidoEn: s.recibidoEn.toISOString(),
      metodo: s.metodo,
      ip: s.ip,
      userAgent: s.userAgent,
      contentType: s.contentType,
      query: s.query ?? "",
      cuerpo: s.cuerpo ?? "",
      ok: s.ok,
      mensaje: s.mensaje ?? "",
      posicionesProcesadas: s.posicionesProcesadas,
    }));
  } catch (err) {
    console.error("[GPS Store] Error obteniendo solicitudes de base de datos:", err);
    return [];
  }
}

export async function limpiarDatosGps(): Promise<void> {
  try {
    await prisma.gpsHistorial.deleteMany();
    await prisma.gpsDispositivo.deleteMany();
    await prisma.gpsSolicitud.deleteMany();
  } catch (err) {
    console.error("[GPS Store] Error limpiando datos GPS en base de datos:", err);
  }
}
