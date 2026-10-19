"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  ArrowPathIcon,
  Battery50Icon,
  BeakerIcon,
  CheckIcon,
  ClipboardDocumentIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
  MapPinIcon,
  SignalIcon,
  TrashIcon,
  ViewfinderCircleIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import config from "@/data/procesiones/config.json";
import type { DispositivoGps, SolicitudGps } from "@/lib/gps-store";

const GpsMapaPruebas = dynamic(() => import("@/components/GpsMapaPruebas"), { ssr: false });

type RespuestaPosiciones = {
  servidor: { horaServidor: string; ipsLocales: string[]; puerto: string };
  dispositivos: DispositivoGps[];
  solicitudes: SolicitudGps[];
};

const INTERVALO_CONSULTA_MS = 3000;
const SEGUNDOS_EN_LINEA = 90; // Recibiendo señal (< 1.5 min)
const SEGUNDOS_CONEXION_PERDIDA = 180; // 3 min sin señal -> Conexión perdida

type EstadoConexion = "en_linea" | "sin_senal" | "perdida" | "esperando";

const obtenerEstadoConexion = (
  ultimaIso: string | null | undefined,
  ahora: number,
): {
  estado: EstadoConexion;
  etiqueta: string;
  color: string;
  bordeColor: string;
  fondoColor: string;
} => {
  if (!ultimaIso) {
    return {
      estado: "esperando",
      etiqueta: "Esperando primera ubicación",
      color: "#9ca3af",
      bordeColor: "#9ca3af40",
      fondoColor: "#9ca3af1A",
    };
  }

  const segundos = Math.max(0, (ahora - new Date(ultimaIso).getTime()) / 1000);

  if (segundos <= SEGUNDOS_EN_LINEA) {
    return {
      estado: "en_linea",
      etiqueta: "Recibiendo señal",
      color: "#34d399",
      bordeColor: "#34d39955",
      fondoColor: "#34d3991A",
    };
  }

  if (segundos <= SEGUNDOS_CONEXION_PERDIDA) {
    return {
      estado: "sin_senal",
      etiqueta: "Sin señal reciente",
      color: "#f59e0b",
      bordeColor: "#f59e0b55",
      fondoColor: "#f59e0b1A",
    };
  }

  return {
    estado: "perdida",
    etiqueta: "Conexión perdida",
    color: "#f87171",
    bordeColor: "#f8717166",
    fondoColor: "#f8717126",
  };
};

const formatearHace = (iso: string, ahora: number) => {
  const segundos = Math.max(0, Math.round((ahora - new Date(iso).getTime()) / 1000));
  if (segundos < 60) return `hace ${segundos} s`;
  const minutos = Math.floor(segundos / 60);
  if (minutos < 60) return `hace ${minutos} min`;
  return `hace ${Math.floor(minutos / 60)} h`;
};

const formatearHora = (iso: string) =>
  new Date(iso).toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

const valorOGuion = (valor: number | null, sufijo: string) => (valor === null ? "—" : `${valor} ${sufijo}`);

export default function GpsPruebasPanel() {
  const [datos, setDatos] = useState<RespuestaPosiciones | null>(null);
  const [errorConsulta, setErrorConsulta] = useState<string | null>(null);
  const [dispositivoSeleccionado, setDispositivoSeleccionado] = useState<string | null>(null);
  const [seguir, setSeguir] = useState(true);
  const [ahora, setAhora] = useState(() => Date.now());
  const [copiado, setCopiado] = useState<string | null>(null);
  const [simulando, setSimulando] = useState(false);

  const consultar = useCallback(async () => {
    try {
      const respuesta = await fetch(`/api/gps/posiciones?_t=${Date.now()}`, { cache: "no-store" });
      if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
      setDatos(await respuesta.json());
      setErrorConsulta(null);
    } catch (error) {
      setErrorConsulta(error instanceof Error ? error.message : "Error al consultar");
    }
  }, []);

  useEffect(() => {
    consultar();
    const intervalo = window.setInterval(consultar, INTERVALO_CONSULTA_MS);
    const reloj = window.setInterval(() => setAhora(Date.now()), 1000);
    return () => {
      window.clearInterval(intervalo);
      window.clearInterval(reloj);
    };
  }, [consultar]);

  const dispositivos = datos?.dispositivos ?? [];
  const dispositivo = useMemo(
    () => dispositivos.find((d) => d.deviceId === dispositivoSeleccionado) ?? dispositivos[0] ?? null,
    [dispositivos, dispositivoSeleccionado],
  );
  const ultima = dispositivo?.ultima ?? null;
  const estadoDispositivo = obtenerEstadoConexion(ultima?.recibidoEn, ahora);

  const urlsServidor = useMemo(() => {
    if (!datos) return [];
    if (
      typeof window !== "undefined" &&
      !window.location.hostname.includes("localhost") &&
      !window.location.hostname.includes("127.0.0.1")
    ) {
      return [`${window.location.origin}/api/gps`];
    }
    const ips = datos.servidor.ipsLocales.length > 0 ? datos.servidor.ipsLocales : ["TU-IP-LOCAL"];
    return ips.map((ip) => `http://${ip}:${datos.servidor.puerto}/api/gps`);
  }, [datos]);

  const copiar = async (texto: string) => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(texto);
      window.setTimeout(() => setCopiado(null), 1800);
    } catch {
      // El portapapeles puede no estar disponible fuera de localhost/https
    }
  };

  const limpiar = async () => {
    await fetch("/api/gps/posiciones", { method: "DELETE" });
    setDispositivoSeleccionado(null);
    consultar();
  };

  /** Envía una ubicación falsa al endpoint para validar que el servidor responde. */
  const simular = async () => {
    setSimulando(true);
    const targetId = dispositivo?.deviceId ?? "simulador-web";
    const base = ultima ?? { latitud: 14.6349, longitud: -90.5069 };
    const parametros = new URLSearchParams({
      id: targetId,
      timestamp: String(Math.floor(Date.now() / 1000)),
      lat: String(base.latitud + (Math.random() - 0.5) * 0.0008),
      lon: String(base.longitud + (Math.random() - 0.5) * 0.0008),
      speed: String(Math.round(Math.random() * 3 * 10) / 10),
      bearing: String(Math.round(Math.random() * 360)),
      accuracy: "8",
      batt: "100",
    });
    await fetch(`/api/gps?${parametros.toString()}`, { method: "POST" });
    setSimulando(false);
    consultar();
  };

  const estadisticas = [
    {
      etiqueta: "Coordenadas",
      valor: ultima ? `${ultima.latitud.toFixed(6)}, ${ultima.longitud.toFixed(6)}` : "—",
      Icono: MapPinIcon,
    },
    { etiqueta: "Precisión", valor: valorOGuion(ultima?.precision ?? null, "m"), Icono: ViewfinderCircleIcon },
    { etiqueta: "Velocidad", valor: valorOGuion(ultima?.velocidad ?? null, "km/h"), Icono: BoltIcon },
    {
      etiqueta: "Batería",
      valor: ultima?.bateria != null ? `${ultima.bateria}%${ultima.cargando ? " ⚡" : ""}` : "—",
      Icono: Battery50Icon,
    },
    {
      etiqueta: "Última señal",
      valor: ultima ? formatearHace(ultima.recibidoEn, ahora) : "—",
      Icono: ClockIcon,
    },
    {
      etiqueta: "Puntos recibidos",
      valor: dispositivo ? String(dispositivo.totalRecibidas) : "0",
      Icono: SignalIcon,
    },
  ];

  const tarjeta = {
    borderColor: `${config.neutralColor}1F`,
    background: `linear-gradient(180deg, ${config.cardColor}CC 0%, ${config.primaryColor}E6 100%)`,
  };

  return (
    <div
      className="min-h-screen px-4 md:px-8 py-10"
      style={{
        background: `radial-gradient(circle at 15% 0%, ${config.idaColor}55 0%, transparent 45%), radial-gradient(circle at 90% 10%, ${config.thirdColor}22 0%, transparent 40%), ${config.secondaryColor}`,
        color: config.neutralColor,
      }}
    >
      <div className="max-w-[1300px] mx-auto flex flex-col gap-6">
        {/* Encabezado */}
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] font-semibold mb-2" style={{ color: config.thirdColor }}>
              Integración Traccar Client · Fase 1
            </p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold">Pruebas de conexión GPS</h1>
          </div>

          <div
            id="estado-conexion-gps"
            className="flex items-center gap-3 rounded-full border px-5 py-2.5 self-start md:self-auto transition-colors"
            style={{
              borderColor: estadoDispositivo.bordeColor,
              background: estadoDispositivo.fondoColor,
            }}
          >
            <span className="relative flex h-3 w-3">
              {estadoDispositivo.estado === "en_linea" && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              )}
              {estadoDispositivo.estado === "perdida" && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-60" style={{ animationDuration: "2s" }} />
              )}
              <span
                className="relative inline-flex h-3 w-3 rounded-full"
                style={{ backgroundColor: estadoDispositivo.color }}
              />
            </span>
            <span
              className="text-sm font-semibold"
              style={{ color: estadoDispositivo.estado === "perdida" ? "#fca5a5" : config.neutralColor }}
            >
              {estadoDispositivo.etiqueta}
              {dispositivo && <span className="opacity-75 font-normal"> ({dispositivo.deviceId})</span>}
            </span>
          </div>
        </header>

        {errorConsulta && (
          <div className="rounded-xl border px-4 py-3 text-sm" style={{ borderColor: "#f8717155", background: "#f871711A" }}>
            No se pudo consultar el servidor: {errorConsulta}
          </div>
        )}

        <div className="grid grid-cols-12 gap-6">
          {/* Columna izquierda: configuración */}
          <aside className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <section className="rounded-2xl border p-6 backdrop-blur" style={tarjeta}>
              <h2 className="text-lg font-serif uppercase tracking-wide mb-4" style={{ color: config.thirdColor }}>
                Configura Traccar Client
              </h2>

              <ol className="flex flex-col gap-4 text-sm" style={{ color: `${config.neutralColor}D9` }}>
                <li>
                  <span className="font-semibold" style={{ color: config.neutralColor }}>1.</span> Conecta el teléfono a la
                  <b> misma red Wi‑Fi</b> que esta computadora.
                </li>
                <li>
                  <span className="font-semibold" style={{ color: config.neutralColor }}>2.</span> En <i>Ajustes → URL del servidor</i> escribe:
                  <div className="mt-2 flex flex-col gap-2">
                    {urlsServidor.map((url) => (
                      <button
                        key={url}
                        type="button"
                        onClick={() => copiar(url)}
                        className="group flex items-center justify-between gap-2 rounded-lg border px-3 py-2 font-mono text-xs text-left transition-all hover:-translate-y-0.5"
                        style={{ borderColor: `${config.thirdColor}55`, background: `${config.primaryColor}B3` }}
                      >
                        <span className="break-all">{url}</span>
                        {copiado === url ? (
                          <CheckIcon className="w-4 h-4 shrink-0 text-emerald-400" />
                        ) : (
                          <ClipboardDocumentIcon className="w-4 h-4 shrink-0 opacity-60 group-hover:opacity-100" />
                        )}
                      </button>
                    ))}
                  </div>
                </li>
                <li>
                  <span className="font-semibold" style={{ color: config.neutralColor }}>3.</span> Deja tu identificador
                  (ej. <code className="font-mono" style={{ color: config.thirdColor }}>pruebas-localizacion</code>).
                </li>
                <li>
                  <span className="font-semibold" style={{ color: config.neutralColor }}>4.</span> Pulsa <b>Enviar ubicación</b> o
                  activa <b>Seguimiento continuo</b>.
                </li>
              </ol>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  id="btn-simular-gps"
                  type="button"
                  onClick={simular}
                  disabled={simulando}
                  className="flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-50"
                  style={{ backgroundColor: config.thirdColor, color: config.primaryColor }}
                >
                  <BeakerIcon className="w-4 h-4" />
                  Simular
                </button>
                <button
                  id="btn-limpiar-gps"
                  type="button"
                  onClick={limpiar}
                  className="flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all hover:-translate-y-0.5"
                  style={{ borderColor: `${config.neutralColor}33`, background: `${config.neutralColor}0D` }}
                >
                  <TrashIcon className="w-4 h-4" />
                  Limpiar
                </button>
              </div>
            </section>

            {/* Dispositivos */}
            <section className="rounded-2xl border p-6" style={tarjeta}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-serif uppercase tracking-wide" style={{ color: config.thirdColor }}>
                  Dispositivos
                </h2>
                <ArrowPathIcon className="w-4 h-4 animate-spin opacity-50" style={{ animationDuration: "3s" }} />
              </div>

              {dispositivos.length === 0 ? (
                <p className="text-sm" style={{ color: `${config.neutralColor}99` }}>
                  Aún no se ha conectado ningún teléfono.
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {dispositivos.map((d) => {
                    const activo = d.deviceId === dispositivo?.deviceId;
                    const estadoDisp = obtenerEstadoConexion(d.ultima?.recibidoEn, ahora);
                    return (
                      <li key={d.deviceId}>
                        <button
                          type="button"
                          onClick={() => setDispositivoSeleccionado(d.deviceId)}
                          className="w-full flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all hover:-translate-y-0.5"
                          style={{
                            borderColor: activo ? config.thirdColor : `${config.neutralColor}1F`,
                            background: activo ? `${config.thirdColor}1A` : "transparent",
                          }}
                        >
                          <DevicePhoneMobileIcon className="w-5 h-5 shrink-0" style={{ color: config.thirdColor }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{d.deviceId}</p>
                            <p className="text-xs flex items-center gap-1.5 flex-wrap" style={{ color: `${config.neutralColor}99` }}>
                              <span>{formatearHace(d.ultima.recibidoEn, ahora)} · {d.totalRecibidas} pts</span>
                              {estadoDisp.estado === "perdida" && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: "#f8717126", color: "#fca5a5" }}>
                                  Conexión perdida
                                </span>
                              )}
                            </p>
                          </div>
                          <span
                            className="h-2.5 w-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: estadoDisp.color }}
                            title={estadoDisp.etiqueta}
                          />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </aside>

          {/* Columna derecha: mapa y datos */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            <section className="rounded-2xl border p-3 h-[460px] md:h-[520px] relative" style={tarjeta}>
              <GpsMapaPruebas
                deviceId={dispositivo?.deviceId}
                posicion={ultima}
                historial={dispositivo?.historial ?? []}
                seguir={seguir}
                colorPrincipal={config.primaryColor}
                colorAcento={config.colorPin}
                colorRastro={config.idaColor}
              />

              {dispositivo && (
                <div
                  className="absolute top-6 left-6 z-[30] flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold shadow-lg backdrop-blur border"
                  style={{
                    backgroundColor: `${config.primaryColor}E6`,
                    borderColor: `${config.thirdColor}55`,
                    color: config.neutralColor,
                  }}
                >
                  <DevicePhoneMobileIcon className="w-3.5 h-3.5" style={{ color: config.thirdColor }} />
                  <span>
                    Dispositivo: <strong style={{ color: config.thirdColor }}>{dispositivo.deviceId}</strong>
                  </span>
                </div>
              )}

              <button
                id="btn-seguir-gps"
                type="button"
                onClick={() => setSeguir((v) => !v)}
                className="absolute top-6 right-6 z-[30] flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold shadow-lg transition-all hover:-translate-y-0.5"
                style={{
                  backgroundColor: seguir ? config.thirdColor : config.extraColor2,
                  color: config.primaryColor,
                }}
              >
                <ViewfinderCircleIcon className="w-4 h-4" />
                {seguir ? "Siguiendo" : "Seguir"}
              </button>
            </section>

            <section className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {estadisticas.map(({ etiqueta, valor, Icono }) => (
                <article
                  key={etiqueta}
                  className="rounded-xl border px-4 py-4 transition-all hover:-translate-y-0.5"
                  style={tarjeta}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icono className="w-4 h-4" style={{ color: config.thirdColor }} />
                    <p className="text-xs uppercase tracking-wide" style={{ color: `${config.neutralColor}B3` }}>
                      {etiqueta}
                    </p>
                  </div>
                  <p className="text-base font-semibold break-all">{valor}</p>
                </article>
              ))}
            </section>

            {/* Log de solicitudes */}
            <section className="rounded-2xl border p-6" style={tarjeta}>
              <h2 className="text-lg font-serif uppercase tracking-wide mb-1" style={{ color: config.thirdColor }}>
                Solicitudes recibidas
              </h2>
              <p className="text-xs mb-4" style={{ color: `${config.neutralColor}99` }}>
                Todo lo que llega a <code className="font-mono">/api/gps</code>, incluso lo rechazado. Útil para depurar.
              </p>

              {(datos?.solicitudes.length ?? 0) === 0 ? (
                <p className="text-sm" style={{ color: `${config.neutralColor}99` }}>
                  Sin solicitudes todavía. Si el teléfono ya envió y aquí no aparece nada, revisa la red Wi‑Fi y el
                  firewall de Windows (puerto {datos?.servidor.puerto ?? "3000"}).
                </p>
              ) : (
                <ul className="flex flex-col gap-2 max-h-[360px] overflow-y-auto custom-scrollbar pr-1"
                  style={{ ["--scroll-thumb-color" as string]: `${config.thirdColor}66` }}
                >
                  {datos!.solicitudes.map((s, i) => (
                    <li key={`${s.recibidoEn}-${i}`}>
                      <details
                        className="rounded-lg border px-3 py-2 text-xs"
                        style={{ borderColor: s.ok ? "#34d39933" : "#f8717144", background: `${config.primaryColor}80` }}
                      >
                        <summary className="cursor-pointer flex flex-wrap items-center gap-2">
                          <span
                            className="rounded px-1.5 py-0.5 font-bold"
                            style={{ background: s.ok ? "#34d39926" : "#f8717126", color: s.ok ? "#6ee7b7" : "#fca5a5" }}
                          >
                            {s.ok ? "200" : "400"}
                          </span>
                          <span className="font-mono">{s.metodo}</span>
                          <span style={{ color: `${config.neutralColor}99` }}>{formatearHora(s.recibidoEn)}</span>
                          <span className="truncate">{s.mensaje}</span>
                        </summary>
                        <div className="mt-2 flex flex-col gap-1 font-mono break-all" style={{ color: `${config.neutralColor}CC` }}>
                          {s.userAgent && <p><b>User-Agent:</b> {s.userAgent}</p>}
                          {s.contentType && <p><b>Content-Type:</b> {s.contentType}</p>}
                          {s.query && <p><b>Query:</b> {s.query}</p>}
                          {s.cuerpo && (
                            <pre className="whitespace-pre-wrap rounded p-2 mt-1" style={{ background: "#00000040" }}>
                              {s.cuerpo}
                            </pre>
                          )}
                        </div>
                      </details>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
