"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  MapPinIcon,
  ArrowLeftIcon,
  MusicalNoteIcon,
  BuildingLibraryIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import ProcesionMapWrapper from "@/components/ProcesionMapWrapper";
import PuntosInteresTimeline from "@/components/PuntosInteresTimeline";
import config from "@/data/procesiones/config.json";
import { formatearHora12 } from "@/lib/date-format";

export interface RecorridoData {
  nombreProcesion: string;
  nombreIglesia: string;
  fecha: string;
  horaSalida: string;
  horaEntrada: string;
  cantidadCargadores: number | string;
  imagenIcono?: string;
  identificadorDispositivo?: string;
  puntosInteres: Array<{
    nombre: string;
    descripcion: string;
    hora?: string;
    ubicacion?: { latitud: number; longitud: number }[];
  }>;
  coordenadas: Array<{
    latitud: number;
    longitud: number;
    regreso: boolean;
  }>;
  canciones?: Array<{
    titulo: string;
    coordenada?:
      | { latitud: number; longitud: number }[]
      | { latitud: number; longitud: number };
  }>;
  historia: Array<{
    titulo: string;
    subtitulo: string;
    historiaIglesia: string;
    subtituloProcesion: string;
    historiaProcesion: string;
  }>;
}

interface ProcesionDetailViewProps {
  dataRecorrido: RecorridoData;
  imagenFondo: string;
  lema: string;
}

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

const formatearFecha = (fecha: string) => {
  const fechaValida = /^\d{4}-\d{2}-\d{2}$/.test(fecha);

  if (!fechaValida) {
    return fecha;
  }

  return new Date(`${fecha}T00:00:00`).toLocaleDateString("es-GT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function ProcesionDetailView({
  dataRecorrido,
  imagenFondo,
  lema,
}: ProcesionDetailViewProps) {
  const [puntoSeleccionado, setPuntoSeleccionado] = useState<{
    latitud: number;
    longitud: number;
  } | null>(null);
  const [centrarTrigger, setCentrarTrigger] = useState(0);
  const [cancionActivaTitulo, setCancionActivaTitulo] = useState<string | null>(
    null
  );
  const [ahoraMs, setAhoraMs] = useState<number | null>(null);

  const datosPrincipales = useMemo(
    () => [
      {
        etiqueta: "Fecha Solemne",
        valor: formatearFecha(dataRecorrido.fecha),
        Icono: CalendarDaysIcon,
      },
      {
        etiqueta: "Hora de Salida",
        valor: formatearHora12(dataRecorrido.horaSalida),
        Icono: ClockIcon,
      },
      {
        etiqueta: "Hora de Entrada",
        valor: formatearHora12(dataRecorrido.horaEntrada),
        Icono: ClockIcon,
      },
      {
        etiqueta: "Cargadores",
        valor: `${dataRecorrido.cantidadCargadores} Brazos`,
        Icono: UserGroupIcon,
      },
    ],
    [dataRecorrido]
  );

  useEffect(() => {
    setAhoraMs(Date.now());
    const intervalo = window.setInterval(() => {
      setAhoraMs(Date.now());
    }, 60_000);

    return () => {
      window.clearInterval(intervalo);
    };
  }, []);

  const mostrarBotonCentrar = useMemo(() => {
    if (ahoraMs === null) return false;

    const salida = parseFechaHora(
      dataRecorrido.fecha,
      dataRecorrido.horaSalida
    );
    const entrada = parseFechaHora(
      dataRecorrido.fecha,
      dataRecorrido.horaEntrada
    );

    if (!salida) {
      return true;
    }

    const ventanaMinutosMs = 15 * 60 * 1000;
    const quinceMinutosAntes = salida.getTime() - ventanaMinutosMs;

    if (entrada && entrada.getTime() > salida.getTime()) {
      const quinceMinutosDespues = entrada.getTime() + ventanaMinutosMs;
      return ahoraMs >= quinceMinutosAntes && ahoraMs <= quinceMinutosDespues;
    }

    return ahoraMs >= quinceMinutosAntes;
  }, [ahoraMs, dataRecorrido.fecha, dataRecorrido.horaSalida, dataRecorrido.horaEntrada]);

  const handlePuntoClick = (punto: { latitud: number; longitud: number }) => {
    setPuntoSeleccionado(punto);
    setTimeout(() => {
      if (window.innerWidth < 1024) {
        const mapa = document.getElementById("contenedor-mapa");
        if (mapa) {
          mapa.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }, 100);
  };

  useEffect(() => {
    if (puntoSeleccionado) {
      const timer = setTimeout(() => {
        setPuntoSeleccionado(null);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [puntoSeleccionado]);

  return (
    <main style={{ backgroundColor: config.primaryColor }}>
      {/* ==================== HERO SECTION ==================== */}
      <section className="min-h-[88vh] flex flex-col justify-between relative overflow-hidden px-4 sm:px-6 lg:px-12 pt-28 pb-16">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0 animate-kenburns"
          style={{
            backgroundImage: `url('${imagenFondo}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Multi-layer Sacred Vignette */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background: `radial-gradient(circle at 50% 30%, ${config.primaryColor}4D 0%, ${config.primaryColor}CC 70%, ${config.primaryColor} 100%)`,
          }}
        />
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background: `linear-gradient(180deg, ${config.headerColor}BF 0%, transparent 25%, ${config.primaryColor}B3 65%, ${config.primaryColor} 100%)`,
          }}
        />

        {/* Top Breadcrumb Bar */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between gap-4 pt-2">
          <Link
            href="/#recorridos-procesionales"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-[0.18em] font-semibold border backdrop-blur-md transition-all duration-300 hover:-translate-x-0.5"
            style={{
              backgroundColor: `${config.secondaryColor}BF`,
              borderColor: `${config.thirdColor}4D`,
              color: config.thirdColor,
            }}
          >
            <ArrowLeftIcon className="w-3.5 h-3.5" />
            <span>Recorridos</span>
          </Link>

          <Link
            href="/recorridos-gt/calendario"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-[0.18em] font-semibold border backdrop-blur-md transition-all duration-300 hover:opacity-90"
            style={{
              backgroundColor: `${config.secondaryColor}BF`,
              borderColor: `${config.neutralColor}26`,
              color: config.neutralColor,
            }}
          >
            <CalendarDaysIcon
              className="w-3.5 h-3.5"
              style={{ color: config.thirdColor }}
            />
            <span>Calendario</span>
          </Link>
        </div>

        {/* Center Hero Title & Stats */}
        <div className="relative z-10 w-full max-w-6xl mx-auto text-center my-auto py-10">
          {/* Sacred Badge (Lema) */}
          <div
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full mb-6 border backdrop-blur-md"
            style={{
              backgroundColor: `${config.secondaryColor}CC`,
              borderColor: `${config.thirdColor}55`,
              boxShadow: `0 0 24px ${config.thirdColor}26`,
            }}
          >
            <span
              className="w-1.5 h-1.5 rotate-45"
              style={{ backgroundColor: config.thirdColor }}
            />
            <span
              className="text-xs sm:text-sm uppercase tracking-[0.28em] font-semibold"
              style={{ color: config.thirdColor }}
            >
              {lema}
            </span>
            <span
              className="w-1.5 h-1.5 rotate-45"
              style={{ backgroundColor: config.thirdColor }}
            />
          </div>

          <h1
            className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold leading-[1.08] mb-10 max-w-5xl mx-auto"
            style={{ color: config.neutralColor }}
          >
            {dataRecorrido.nombreProcesion}
            <span
              className="block italic font-medium text-3xl sm:text-5xl md:text-6xl mt-3"
              style={{
                color: config.thirdColor,
                textShadow: `0 4px 25px ${config.thirdColor}33`,
              }}
            >
              {dataRecorrido.nombreIglesia}
            </span>
          </h1>

          {/* 4 Glassmorphic Stat Cards (2x2 on phones, 4 cols on desktop) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 max-w-5xl mx-auto">
            {datosPrincipales.map(({ etiqueta, valor, Icono }) => (
              <article
                key={etiqueta}
                className="relative rounded-2xl px-3 py-3.5 sm:px-5 sm:py-5 border text-center backdrop-blur-xl overflow-hidden transition-transform duration-300 hover:-translate-y-1"
                style={{
                  borderColor: `${config.thirdColor}40`,
                  background: `linear-gradient(160deg, ${config.secondaryColor}D9 0%, ${config.primaryColor}E6 100%)`,
                  boxShadow: `0 12px 30px -10px rgba(0,0,0,0.6)`,
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${config.thirdColor}, transparent)`,
                  }}
                />
                <div
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl mx-auto mb-2 sm:mb-3 flex items-center justify-center border"
                  style={{
                    backgroundColor: `${config.thirdColor}1A`,
                    borderColor: `${config.thirdColor}40`,
                  }}
                >
                  <Icono
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    style={{ color: config.thirdColor }}
                  />
                </div>
                <p
                  className="text-[10px] sm:text-[11px] uppercase tracking-[0.14em] sm:tracking-[0.2em] font-semibold mb-0.5 sm:mb-1"
                  style={{ color: `${config.neutralColor}99` }}
                >
                  {etiqueta}
                </p>
                <p
                  className="text-sm sm:text-lg font-serif font-bold leading-snug"
                  style={{ color: config.neutralColor }}
                >
                  {valor}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="relative z-10" />
      </section>

      {/* ==================== MAP & TIMELINE SECTION ==================== */}
      <section className="px-4 sm:px-6 lg:px-12 pb-24 pt-4">
        <div className="w-full max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-5 border-b"
            style={{ borderColor: `${config.thirdColor}26` }}
          >
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span
                  className="w-2 h-2 rotate-45"
                  style={{ backgroundColor: config.thirdColor }}
                />
                <span
                  className="text-xs uppercase tracking-[0.28em] font-semibold"
                  style={{ color: config.thirdColor }}
                >
                  Guía Interactiva del Cortejo
                </span>
              </div>
              <h2
                className="text-3xl sm:text-4xl font-serif font-bold"
                style={{ color: config.neutralColor }}
              >
                Mapa y Puntos de Referencia
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {mostrarBotonCentrar ? (
                <span
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-widest font-bold border"
                  style={{
                    backgroundColor: `${config.thirdColor}22`,
                    borderColor: config.thirdColor,
                    color: config.thirdColor,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full animate-ping"
                    style={{ backgroundColor: config.thirdColor }}
                  />
                  Cortejo en Horario Activo
                </span>
              ) : (
                <span
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-widest font-medium border"
                  style={{
                    backgroundColor: `${config.secondaryColor}CC`,
                    borderColor: `${config.neutralColor}22`,
                    color: `${config.neutralColor}B3`,
                  }}
                >
                  <ClockIcon
                    className="w-4 h-4"
                    style={{ color: config.thirdColor }}
                  />
                  Recorrido Oficial
                </span>
              )}
            </div>
          </div>

          {/* 12-Column Grid: Timeline (4) + Map (8) */}
          <div className="grid grid-cols-12 gap-6 lg:gap-8">
            {/* Left Aside: Puntos de Interés */}
            <aside
              className="col-span-12 lg:col-span-4 rounded-3xl border p-4 sm:p-6 h-[460px] sm:h-[560px] lg:h-[720px] flex flex-col relative overflow-hidden"
              style={{
                borderColor: `${config.thirdColor}40`,
                background: `linear-gradient(180deg, ${config.secondaryColor}EB 0%, ${config.primaryColor}F5 100%)`,
                boxShadow: `0 20px 50px -15px rgba(0,0,0,0.6)`,
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{
                  background: `linear-gradient(90deg, transparent, ${config.thirdColor}, transparent)`,
                }}
              />

              <div
                className="pb-4 mb-4 border-b flex items-center justify-between gap-2"
                style={{ borderColor: `${config.neutralColor}1A` }}
              >
                <div>
                  <h3
                    className="text-xl sm:text-2xl font-serif font-bold uppercase tracking-wider"
                    style={{ color: config.thirdColor }}
                  >
                    Puntos de Interés
                  </h3>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: `${config.neutralColor}99` }}
                  >
                    Toca un punto para centrarlo en el mapa
                  </p>
                </div>

                <span
                  className="text-xs font-mono font-bold px-2.5 py-1 rounded-full border shrink-0"
                  style={{
                    backgroundColor: `${config.thirdColor}1F`,
                    borderColor: `${config.thirdColor}4D`,
                    color: config.thirdColor,
                  }}
                >
                  {dataRecorrido.puntosInteres.length}
                </span>
              </div>

              <PuntosInteresTimeline
                puntos={dataRecorrido.puntosInteres}
                fecha={dataRecorrido.fecha}
                primaryColor={config.primaryColor}
                neutralColor={config.neutralColor}
                thirdColor={config.thirdColor}
                onPuntoClick={handlePuntoClick}
                puntoSeleccionado={puntoSeleccionado}
              />
            </aside>

            {/* Right Container: Interactive Map & Legend */}
            <div
              id="contenedor-mapa"
              className="col-span-12 lg:col-span-8 rounded-3xl border p-3 sm:p-5 h-[560px] sm:h-[660px] lg:h-[720px] flex flex-col relative overflow-hidden"
              style={{
                borderColor: `${config.thirdColor}40`,
                backgroundColor: `${config.secondaryColor}EB`,
                boxShadow: `0 20px 50px -15px rgba(0,0,0,0.6)`,
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{
                  background: `linear-gradient(90deg, transparent, ${config.thirdColor}, transparent)`,
                }}
              />

              {/* Encabezado interno del Croquis (Nombre, Iglesia e Ícono si aplica) */}
              <div
                className="mb-3 pb-3 border-b flex items-center justify-center sm:justify-between gap-3 px-2"
                style={{ borderColor: `${config.thirdColor}26` }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {dataRecorrido.imagenIcono &&
                    dataRecorrido.imagenIcono.trim() !== "" && (
                      <div
                        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden shrink-0 border-2 shadow-md"
                        style={{
                          borderColor: config.thirdColor,
                          backgroundColor: config.primaryColor,
                        }}
                      >
                        <img
                          src={dataRecorrido.imagenIcono}
                          alt={dataRecorrido.nombreProcesion}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                  <div className="min-w-0 text-center sm:text-left">
                    <h3
                      className="text-lg sm:text-xl md:text-2xl font-serif font-bold leading-tight truncate"
                      style={{ color: config.thirdColor }}
                    >
                      {dataRecorrido.nombreProcesion}
                    </h3>
                    <p
                      className="text-xs sm:text-sm font-serif italic truncate opacity-90"
                      style={{ color: config.thirdColor }}
                    >
                      {dataRecorrido.nombreIglesia}
                    </p>
                  </div>
                </div>

                <div
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border shrink-0 text-xs font-semibold"
                  style={{
                    backgroundColor: `${config.primaryColor}B3`,
                    borderColor: `${config.thirdColor}33`,
                    color: config.thirdColor,
                  }}
                >
                  <CalendarDaysIcon className="w-4 h-4" />
                  <span>{formatearFecha(dataRecorrido.fecha)}</span>
                </div>
              </div>

              <div
                className="flex-1 min-h-0 w-full rounded-2xl overflow-hidden border"
                style={{ borderColor: `${config.thirdColor}33` }}
              >
                <ProcesionMapWrapper
                  coordenadas={dataRecorrido.coordenadas}
                  primaryColor={config.primaryColor}
                  vueltaColor={config.vueltaColor}
                  idaColor={config.idaColor}
                  fecha={dataRecorrido.fecha}
                  horaSalida={dataRecorrido.horaSalida}
                  horaEntrada={dataRecorrido.horaEntrada}
                  pinColor={config.colorPin}
                  puntoInteresSeleccionado={puntoSeleccionado}
                  centrarTrigger={centrarTrigger}
                  imagenUrl={dataRecorrido.imagenIcono}
                  identificadorDispositivo={
                    dataRecorrido.identificadorDispositivo
                  }
                  canciones={dataRecorrido.canciones}
                  puntosInteres={dataRecorrido.puntosInteres}
                  neutralColor={config.neutralColor}
                  thirdColor={config.thirdColor}
                  onCancionActivaChange={(cancion) =>
                    setCancionActivaTitulo(cancion?.titulo ?? null)
                  }
                />
              </div>

              {/* Legend & Controls Bar + Watermark */}
              <section
                className="mt-3.5 rounded-2xl border px-4 py-3 shadow-inner relative"
                style={{
                  backgroundColor: config.extraColor2,
                  borderColor: `${config.primaryColor}33`,
                }}
              >
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-7">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3.5 w-7 rounded-full inline-block shadow-sm"
                      style={{ backgroundColor: config.idaColor }}
                    />
                    <p
                      className="text-xs sm:text-sm font-bold uppercase tracking-wider"
                      style={{ color: config.primaryColor }}
                    >
                      Recorrido de Ida
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className="h-0 w-7 inline-block border-t-[3.5px] border-dashed"
                      style={{ borderColor: config.vueltaColor }}
                    />
                    <p
                      className="text-xs sm:text-sm font-bold uppercase tracking-wider"
                      style={{ color: config.primaryColor }}
                    >
                      Recorrido de Vuelta
                    </p>
                  </div>

                  <div
                    className="h-5 w-px hidden sm:block"
                    style={{ backgroundColor: `${config.primaryColor}33` }}
                  />

                  {mostrarBotonCentrar ? (
                    <button
                      type="button"
                      onClick={() => setCentrarTrigger((prev) => prev + 1)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all duration-300 hover:scale-[1.02] shadow-md cursor-pointer"
                      style={{
                        backgroundColor: config.thirdColor,
                        color: config.primaryColor,
                      }}
                    >
                      <MapPinIcon className="w-3.5 h-3.5" />
                      Centrar Procesión
                    </button>
                  ) : (
                    <div
                      className="flex items-center gap-1.5 opacity-80 select-none"
                      style={{ color: config.primaryColor }}
                    >
                      <span
                        className="w-1.5 h-1.5 rotate-45 shrink-0"
                        style={{ backgroundColor: config.idaColor }}
                      />
                      <span className="text-[11px] sm:text-xs font-serif font-bold tracking-wider uppercase whitespace-nowrap">
                        Recorridos Procesionales GT
                      </span>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECCIÓN DE CANCIONES / MARCHAS SACRAS ==================== */}
      {dataRecorrido.canciones && dataRecorrido.canciones.length > 0 && (
        <section
          className="px-4 sm:px-6 lg:px-12 py-24 border-t relative overflow-hidden"
          style={{
            backgroundColor: config.secondaryColor,
            borderColor: `${config.thirdColor}26`,
          }}
        >
          <div className="w-full max-w-7xl mx-auto relative z-10">
            {/* Bloque de Título */}
            <div className="text-center max-w-2xl mx-auto mb-14 flex flex-col items-center">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="h-px w-10 md:w-16"
                  style={{ backgroundColor: config.thirdColor }}
                />
                <span
                  className="uppercase tracking-[0.28em] text-xs font-semibold flex items-center gap-2"
                  style={{ color: config.thirdColor }}
                >
                  <MusicalNoteIcon className="w-4 h-4" />
                  <span>Acompañamiento Musical</span>
                </span>
                <div
                  className="h-px w-10 md:w-16"
                  style={{ backgroundColor: config.thirdColor }}
                />
              </div>

              <h2
                className="text-3xl sm:text-5xl font-serif font-bold mb-4"
                style={{ color: config.neutralColor }}
              >
                Marchas del{" "}
                <span className="italic" style={{ color: config.thirdColor }}>
                  Recorrido
                </span>
              </h2>

              <p
                className="text-sm sm:text-base"
                style={{ color: `${config.neutralColor}B3` }}
              >
                Repertorio solemne de marchas fúnebres interpretadas durante el
                cortejo. Selecciona una marcha para ver su ubicación en el mapa.
              </p>
            </div>

            {/* Grid de Canciones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dataRecorrido.canciones.map((cancion, idx) => {
                const esActiva = Boolean(
                  mostrarBotonCentrar && cancionActivaTitulo === cancion.titulo
                );
                const coord =
                  Array.isArray(cancion.coordenada) && cancion.coordenada[0]
                    ? cancion.coordenada[0]
                    : cancion.coordenada &&
                        typeof cancion.coordenada === "object" &&
                        "latitud" in cancion.coordenada
                      ? cancion.coordenada
                      : null;

                return (
                  <article
                    key={`${cancion.titulo}-${idx}`}
                    onClick={() => {
                      if (
                        coord &&
                        typeof coord.latitud === "number" &&
                        typeof coord.longitud === "number"
                      ) {
                        handlePuntoClick(coord);
                      }
                    }}
                    className={`group relative rounded-2xl p-4.5 border transition-all duration-300 ${
                      coord
                        ? "cursor-pointer hover:-translate-y-1"
                        : ""
                    }`}
                    style={{
                      borderColor: esActiva
                        ? config.thirdColor
                        : `${config.thirdColor}26`,
                      backgroundColor: esActiva
                        ? `${config.primaryColor}F5`
                        : `${config.cardColor}B3`,
                      backdropFilter: "blur(8px)",
                      boxShadow: esActiva
                        ? `0 12px 30px -5px ${config.thirdColor}4D`
                        : "none",
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span
                          className="text-xs font-mono font-bold px-2.5 py-1.5 rounded-lg transition-colors shrink-0 border"
                          style={{
                            backgroundColor: esActiva
                              ? config.thirdColor
                              : `${config.primaryColor}99`,
                            borderColor: esActiva
                              ? config.thirdColor
                              : `${config.thirdColor}33`,
                            color: esActiva
                              ? config.primaryColor
                              : config.thirdColor,
                          }}
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <h3
                            className="font-serif font-bold text-lg truncate transition-colors"
                            style={{
                              color: esActiva
                                ? config.thirdColor
                                : config.neutralColor,
                            }}
                          >
                            {cancion.titulo}
                          </h3>
                          {coord && (
                            <span
                              className="text-[11px] uppercase tracking-wider flex items-center gap-1 opacity-75 group-hover:opacity-100"
                              style={{ color: config.thirdColor }}
                            >
                              <MapPinIcon className="w-3 h-3" />
                              Ver punto en el mapa
                            </span>
                          )}
                        </div>
                      </div>

                      {esActiva ? (
                        <span
                          className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-bold px-3 py-1 rounded-full animate-pulse shrink-0 shadow-sm"
                          style={{
                            backgroundColor: config.thirdColor,
                            color: config.primaryColor,
                          }}
                        >
                          <span>🎵</span>
                          <span>Sonando</span>
                        </span>
                      ) : (
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity shrink-0"
                          style={{
                            backgroundColor: `${config.thirdColor}1A`,
                            color: config.thirdColor,
                          }}
                        >
                          <MusicalNoteIcon className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ==================== SECCIÓN DE HISTORIA ==================== */}
      {dataRecorrido.historia && dataRecorrido.historia.length > 0 && (
        <section
          className="px-4 sm:px-6 lg:px-12 py-28 border-t relative overflow-hidden"
          style={{
            backgroundColor: config.secondaryColor,
            borderColor: `${config.thirdColor}26`,
          }}
        >
          {/* Ambient radial glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-[160px] pointer-events-none opacity-10"
            style={{ backgroundColor: config.thirdColor }}
          />

          <div className="w-full max-w-6xl mx-auto flex flex-col gap-20 relative z-10">
            {dataRecorrido.historia.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-14">
                {/* Bloque de Título */}
                <div className="text-center max-w-4xl mx-auto flex flex-col items-center">
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="h-px w-12 md:w-20"
                      style={{ backgroundColor: config.thirdColor }}
                    />
                    <span
                      className="uppercase tracking-[0.3em] text-xs font-semibold flex items-center gap-2"
                      style={{ color: config.thirdColor }}
                    >
                      <SparklesIcon className="w-4 h-4" />
                      Crónica y Patrimonio Histórico
                    </span>
                    <div
                      className="h-px w-12 md:w-20"
                      style={{ backgroundColor: config.thirdColor }}
                    />
                  </div>

                  <h2
                    className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold mb-8 leading-[1.15]"
                    style={{ color: config.neutralColor }}
                  >
                    {item.titulo}
                  </h2>

                  <div className="flex items-center gap-2">
                    <span
                      className="h-0.5 w-12 rounded-full"
                      style={{ backgroundColor: config.thirdColor }}
                    />
                    <span
                      className="w-2.5 h-2.5 rotate-45"
                      style={{ backgroundColor: config.thirdColor }}
                    />
                    <span
                      className="h-0.5 w-12 rounded-full"
                      style={{ backgroundColor: config.thirdColor }}
                    />
                  </div>
                </div>

                {/* Bloque de Textos en Tarjetas Editoriales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
                  {/* Historia de la Iglesia */}
                  <article
                    className="rounded-3xl p-8 sm:p-10 border flex flex-col relative overflow-hidden"
                    style={{
                      backgroundColor: `${config.primaryColor}CC`,
                      borderColor: `${config.thirdColor}33`,
                      boxShadow: `0 16px 40px -15px rgba(0,0,0,0.5)`,
                    }}
                  >
                    <div
                      className="absolute top-0 left-0 right-0 h-1"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${config.thirdColor}, transparent)`,
                      }}
                    />

                    <div className="flex items-center gap-3 mb-6 pb-4 border-b"
                      style={{ borderColor: `${config.neutralColor}14` }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                        style={{
                          backgroundColor: `${config.thirdColor}1A`,
                          borderColor: `${config.thirdColor}40`,
                        }}
                      >
                        <BuildingLibraryIcon
                          className="w-5 h-5"
                          style={{ color: config.thirdColor }}
                        />
                      </div>
                      <h3
                        className="text-xl sm:text-2xl font-serif font-bold uppercase tracking-[0.12em] leading-snug"
                        style={{ color: config.thirdColor }}
                      >
                        {item.subtitulo}
                      </h3>
                    </div>

                    <p
                      className="text-base sm:text-lg leading-relaxed font-light text-left sm:text-justify"
                      style={{ color: `${config.neutralColor}E6` }}
                    >
                      {item.historiaIglesia}
                    </p>
                  </article>

                  {/* Historia de la Procesión */}
                  <article
                    className="rounded-3xl p-8 sm:p-10 border flex flex-col relative overflow-hidden"
                    style={{
                      backgroundColor: `${config.primaryColor}CC`,
                      borderColor: `${config.thirdColor}33`,
                      boxShadow: `0 16px 40px -15px rgba(0,0,0,0.5)`,
                    }}
                  >
                    <div
                      className="absolute top-0 left-0 right-0 h-1"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${config.thirdColor}, transparent)`,
                      }}
                    />

                    <div className="flex items-center gap-3 mb-6 pb-4 border-b"
                      style={{ borderColor: `${config.neutralColor}14` }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                        style={{
                          backgroundColor: `${config.thirdColor}1A`,
                          borderColor: `${config.thirdColor}40`,
                        }}
                      >
                        <SparklesIcon
                          className="w-5 h-5"
                          style={{ color: config.thirdColor }}
                        />
                      </div>
                      <h3
                        className="text-xl sm:text-2xl font-serif font-bold uppercase tracking-[0.12em] leading-snug"
                        style={{ color: config.thirdColor }}
                      >
                        {item.subtituloProcesion}
                      </h3>
                    </div>

                    <p
                      className="text-base sm:text-lg leading-relaxed font-light text-left sm:text-justify"
                      style={{ color: `${config.neutralColor}E6` }}
                    >
                      {item.historiaProcesion}
                    </p>
                  </article>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
