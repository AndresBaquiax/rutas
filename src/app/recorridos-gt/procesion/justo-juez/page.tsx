"use client";

import { useEffect, useState } from "react";
import {
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import ProcesionMapWrapper from "@/components/ProcesionMapWrapper";
import PuntosInteresTimeline from "@/components/PuntosInteresTimeline";
import config from "@/data/config.json";
import dataRecorrido from "@/data/viernesSanto/dataRecorridoJustoJuez.json";
import { formatearHora12 } from "@/lib/date-format";

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
  const [puntoSeleccionado, setPuntoSeleccionado] = useState<{latitud: number; longitud: number} | null>(null);
  const [centrarTrigger, setCentrarTrigger] = useState(0);

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
            backgroundImage: "url('/carruselFotos/1.jpg')",
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
              onPuntoClick={setPuntoSeleccionado}
            />
          </aside>

          <div
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
              </div>
            </section>
          </div>
        </div>
      </section>

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
