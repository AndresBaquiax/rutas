"use client";

import { useEffect, useState, useMemo } from "react";
import {
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import ProcesionMapWrapper from "@/components/ProcesionMapWrapper";
import PuntosInteresTimeline from "@/components/PuntosInteresTimeline";
import config from "@/data/procesiones/config.json";
import dataRecorrido from "@/data/procesiones/velaciones/Catedral/dataRecorridoVelacionJustoJuez.json";
import { formatearHora12 } from "@/lib/date-format";

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

const datosPrincipales = [
  {
    etiqueta: "Fecha",
    valor: formatearFecha(dataRecorrido.fecha),
    Icono: CalendarDaysIcon,
  },
  {
    etiqueta: "Salida",
    valor: formatearHora12(dataRecorrido.horaSalida),
    Icono: ClockIcon,
  },
  {
    etiqueta: "Entrada",
    valor: formatearHora12(dataRecorrido.horaEntrada),
    Icono: ClockIcon,
  },
  {
    etiqueta: "Cargadores",
    valor: String(dataRecorrido.cantidadCargadores),
    Icono: UserGroupIcon,
  },
];

export default function InformacionPage() {
  const tamanoSeccion = "h-[700px]";
  const [puntoSeleccionado, setPuntoSeleccionado] = useState<{ latitud: number; longitud: number } | null>(null);
  const [centrarTrigger, setCentrarTrigger] = useState(0);
  const [cancionActivaTitulo, setCancionActivaTitulo] = useState<string | null>(null);

  const [ahoraMs, setAhoraMs] = useState<number | null>(null);

  useEffect(() => {
    setAhoraMs(Date.now());
    const intervalo = window.setInterval(() => {
      setAhoraMs(Date.now());
    }, 500000);

    return () => {
      window.clearInterval(intervalo);
    };
  }, []);

  const mostrarBotonCentrar = useMemo(() => {
    if (ahoraMs === null) return false;

    const salida = parseFechaHora(dataRecorrido.fecha, dataRecorrido.horaSalida);
    const entrada = parseFechaHora(dataRecorrido.fecha, dataRecorrido.horaEntrada);

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
  }, [ahoraMs]);

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
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-6 py-24">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/fotoCatedral.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>

        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${config.primaryColor}33 25%, ${config.primaryColor}80 45%, ${config.primaryColor}CC 68%, ${config.primaryColor} 100%)`,
          }}
        ></div>

        <div className="relative z-10 w-full max-w-[1200px] mx-auto text-center">
          <p
            className="text-sm uppercase tracking-widest mb-4 font-medium px-6 py-3 rounded-full inline-block"
            style={{
              color: config.thirdColor,
              background: `linear-gradient(90deg, ${config.primaryColor}00 0%, ${config.primaryColor}E6 20%, ${config.primaryColor}E6 80%, ${config.primaryColor}00 100%)`,
            }}
          >
            Caminando junto a ti
          </p>

          <h1
            className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-12"
            style={{ color: config.neutralColor }}
          >
            {dataRecorrido.nombreProcesion}
            <br />
            <span className="italic" style={{ color: config.thirdColor }}>
              {dataRecorrido.nombreIglesia}
            </span>
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-[1040px] mx-auto">
            {datosPrincipales.map(({ etiqueta, valor, Icono }) => (
              <article
                key={etiqueta}
                className="rounded-xl px-3 py-4 border text-center"
                style={{
                  borderColor: `${config.neutralColor}2A`,
                  background: `${config.primaryColor}A6`,
                  backdropFilter: "blur(3px)",
                }}
              >
                <div className="flex justify-center mb-2">
                  <Icono
                    className="w-7 h-7"
                    strokeWidth={2.4}
                    style={{ color: config.thirdColor, opacity: 1 }}
                  />
                </div>
                <div className="mb-1">
                  <p
                    className="text-sm uppercase tracking-wide"
                    style={{ color: `${config.neutralColor}B3` }}
                  >
                    {etiqueta}
                  </p>
                </div>
                <p
                  className="text-base font-semibold leading-snug"
                  style={{ color: config.neutralColor }}
                >
                  {valor}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="w-full max-w-[1200px] mx-auto grid grid-cols-12 gap-6">
          <aside
            className={`col-span-12 lg:col-span-4 rounded-2xl border p-6 ${tamanoSeccion} flex flex-col`}
            style={{
              borderColor: `${config.neutralColor}2A`,
              background: `linear-gradient(180deg, ${config.primaryColor}CC 0%, ${config.primaryColor}E6 100%)`,
            }}
          >
            <h2
              className="text-2xl font-serif mb-6 uppercase tracking-wide"
              style={{ color: config.thirdColor }}
            >
              Puntos de interés
            </h2>

            <PuntosInteresTimeline
              puntos={dataRecorrido.puntosInteres}
              fecha={dataRecorrido.fecha}
              primaryColor={config.primaryColor}
              neutralColor={config.neutralColor}
              thirdColor={config.thirdColor}
              onPuntoClick={handlePuntoClick}
            />
          </aside>

          <div
            id="contenedor-mapa"
            className={`col-span-12 lg:col-span-8 rounded-2xl border p-4 ${tamanoSeccion} flex flex-col`}
            style={{
              borderColor: `${config.neutralColor}2A`,
              backgroundColor: `${config.primaryColor}CC`,
            }}
          >
            <div className="flex-1 min-h-0 w-full">
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
                imagenUrl={(dataRecorrido as any).imagenIcono}
                identificadorDispositivo={(dataRecorrido as any).identificadorDispositivo}
                canciones={(dataRecorrido as any).canciones}
                neutralColor={config.neutralColor}
                thirdColor={config.thirdColor}
                onCancionActivaChange={(cancion) => setCancionActivaTitulo(cancion?.titulo ?? null)}
              />
            </div>

            <section
              className="mt-4 rounded-xl border px-4 py-3"
              style={{
                backgroundColor: config.extraColor2,
                borderColor: `${config.primaryColor}26`,
              }}
            >
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: config.idaColor }}
                  />
                  <p
                    className="text-sm font-medium"
                    style={{ color: config.primaryColor }}
                  >
                    Recorrido de ida
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: config.vueltaColor }}
                  />
                  <p
                    className="text-sm font-medium"
                    style={{ color: config.primaryColor }}
                  >
                    Recorrido de vuelta
                  </p>
                </div>

                {mostrarBotonCentrar && (
                  <>
                    <div
                      className="h-6 w-px hidden md:block"
                      style={{ backgroundColor: `${config.primaryColor}33` }}
                    />

                    <button
                      type="button"
                      onClick={() => setCentrarTrigger((prev) => prev + 1)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-80 shadow-sm"
                      style={{ backgroundColor: config.thirdColor, color: config.primaryColor }}
                    >
                      <MapPinIcon className="w-4 h-4" />
                      Centrar procesión
                    </button>
                  </>
                )}
              </div>
            </section>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE CANCIONES / MARCHAS SACRAS */}
      {(dataRecorrido as any).canciones && (dataRecorrido as any).canciones.length > 0 && (
        <section
          className="px-6 py-24 border-t"
          style={{
            backgroundColor: config.secondaryColor,
            borderColor: `${config.thirdColor}22`,
          }}
        >
          <div className="w-full max-w-[1200px] mx-auto">
            {/* Bloque de Título */}
            <div className="text-center max-w-2xl mx-auto mb-10 flex flex-col items-center">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="h-px w-8 md:w-16"
                  style={{ backgroundColor: config.thirdColor }}
                />
                <span
                  className="uppercase tracking-[0.25em] text-xs md:text-sm font-semibold flex items-center gap-2"
                  style={{ color: config.thirdColor }}
                >
                  <span>🎵</span>
                  <span>Acompañamiento Musical</span>
                </span>
                <div
                  className="h-px w-8 md:w-16"
                  style={{ backgroundColor: config.thirdColor }}
                />
              </div>

              <h2
                className="text-3xl md:text-5xl font-serif font-bold mb-4"
                style={{ color: config.neutralColor }}
              >
                Marchas del Recorrido
              </h2>

              <div
                className="h-1 w-16 rounded-full"
                style={{ backgroundColor: config.thirdColor }}
              />
            </div>

            {/* Grid de Canciones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(dataRecorrido as any).canciones.map((cancion: any, idx: number) => {
                const esActiva = Boolean(mostrarBotonCentrar && cancionActivaTitulo === cancion.titulo);
                const coord = Array.isArray(cancion.coordenada) && cancion.coordenada[0]
                  ? cancion.coordenada[0]
                  : cancion.coordenada && typeof cancion.coordenada === "object" && "latitud" in cancion.coordenada
                    ? cancion.coordenada
                    : null;

                return (
                  <article
                    key={`${cancion.titulo}-${idx}`}
                    onClick={() => {
                      if (coord && typeof coord.latitud === "number" && typeof coord.longitud === "number") {
                        handlePuntoClick(coord);
                      }
                    }}
                    className={`group relative rounded-xl p-4 border transition-all duration-300 ${coord ? "cursor-pointer hover:scale-[1.01]" : ""
                      }`}
                    style={{
                      borderColor: esActiva ? config.thirdColor : `${config.neutralColor}2A`,
                      backgroundColor: esActiva ? `${config.primaryColor}F2` : `${config.cardColor ?? config.primaryColor}CC`,
                      backdropFilter: "blur(4px)",
                      boxShadow: esActiva ? `0 0 24px ${config.thirdColor}4D` : "none",
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span
                          className="text-xs font-mono font-bold px-2.5 py-1 rounded transition-colors"
                          style={{
                            backgroundColor: esActiva ? config.thirdColor : `${config.neutralColor}1A`,
                            color: esActiva ? config.primaryColor : `${config.neutralColor}B3`,
                          }}
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <h3
                            className="font-serif font-semibold text-base truncate transition-colors"
                            style={{
                              color: esActiva ? config.thirdColor : config.neutralColor,
                            }}
                          >
                            {cancion.titulo}
                          </h3>
                        </div>
                      </div>

                      {esActiva ? (
                        <span
                          className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full animate-pulse flex-shrink-0 shadow-sm"
                          style={{
                            backgroundColor: config.thirdColor,
                            color: config.primaryColor,
                          }}
                        >
                          <span>🎵</span>
                          <span>Sonando ahora</span>
                        </span>
                      ) : (
                        <span
                          className="text-sm opacity-35 group-hover:opacity-75 transition-opacity"
                          title={coord ? "Ver punto en el mapa" : undefined}
                        >
                          🎵
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* SECCIÓN DE HISTORIA */}
      <section
        className="px-6 py-28 mt-4 border-t"
        style={{
          backgroundColor: config.secondaryColor,
          borderColor: `${config.thirdColor}22`,
        }}
      >
        <div className="w-full max-w-[1000px] mx-auto flex flex-col gap-24">
          {dataRecorrido.historia.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-20">
              {/* Bloque de Título */}
              <div className="text-center max-w-4xl mx-auto flex flex-col items-center">
                <div className="flex items-center gap-4 mb-8">
                  <div
                    className="h-px w-12 md:w-20"
                    style={{ backgroundColor: config.thirdColor }}
                  />
                  <span
                    className="uppercase tracking-[0.3em] text-xs md:text-sm font-semibold"
                    style={{ color: config.thirdColor }}
                  >
                    Sección Histórica
                  </span>
                  <div
                    className="h-px w-12 md:w-20"
                    style={{ backgroundColor: config.thirdColor }}
                  />
                </div>

                <h2
                  className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium mb-10 leading-[1.2]"
                  style={{ color: config.neutralColor }}
                >
                  {item.titulo}
                </h2>

                <div
                  className="h-1 w-20 rounded-full"
                  style={{ backgroundColor: config.thirdColor }}
                />
              </div>

              {/* Bloque de Textos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
                {/* Historia de la Iglesia */}
                <div className="flex flex-col gap-6">
                  <h3
                    className="text-xl md:text-2xl font-serif uppercase tracking-[0.15em] leading-snug"
                    style={{ color: config.thirdColor }}
                  >
                    {item.subtitulo}
                  </h3>
                  <p
                    className="text-lg leading-relaxed font-light text-left sm:text-justify"
                    style={{ color: `${config.neutralColor}E6` }}
                  >
                    {item.historiaIglesia}
                  </p>
                </div>

                {/* Historia de la Procesión */}
                <div className="flex flex-col gap-6">
                  <h3
                    className="text-xl md:text-2xl font-serif uppercase tracking-[0.15em] leading-snug"
                    style={{ color: config.thirdColor }}
                  >
                    {item.subtituloProcesion}
                  </h3>
                  <p
                    className="text-lg leading-relaxed font-light text-left sm:text-justify"
                    style={{ color: `${config.neutralColor}E6` }}
                  >
                    {item.historiaProcesion}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
