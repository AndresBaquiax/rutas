import {
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import type { CSSProperties } from "react";
import ProcesionMapWrapper from "@/components/ProcesionMapWrapper";
import config from "@/data/config.json";
import dataRecorrido from "@/data/dataRecorrido.json";

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

const formatearHora = (hora: string) => {
  const horaValida = /^\d{2}:\d{2}$/.test(hora);

  if (!horaValida) {
    return hora;
  }

  return new Date(`1970-01-01T${hora}:00`).toLocaleTimeString("es-GT", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
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
    valor: dataRecorrido.horaSalida,
    Icono: ClockIcon,
  },
  {
    etiqueta: "Entrada",
    valor: dataRecorrido.horaEntrada,
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
            Protector de Quetzaltenango
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

            <div
              className="space-y-6 overflow-y-auto pr-2 flex-1 custom-scrollbar"
              style={{ "--scroll-thumb-color": config.thirdColor } as CSSProperties}
            >
              {dataRecorrido.puntosInteres.map((punto, index) => (
                <article key={`${punto.nombre}-${index}`} className="relative pl-6">
                  <span
                    className="absolute left-0 top-2 h-3 w-3 rounded-full"
                    style={{ backgroundColor: config.thirdColor }}
                  />

                  {index < dataRecorrido.puntosInteres.length - 1 && (
                    <span
                      className="absolute left-[5px] top-5 h-[calc(100%+12px)] w-[2px]"
                      style={{ backgroundColor: `${config.thirdColor}55` }}
                    />
                  )}

                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="font-serif text-2xl leading-tight" style={{ color: config.neutralColor }}>
                      {punto.nombre}
                    </h3>

                    <span
                      className="text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap"
                      style={{
                        color: config.primaryColor,
                        backgroundColor: config.thirdColor,
                      }}
                    >
                      {formatearHora(punto.hora)}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed" style={{ color: `${config.neutralColor}C7` }}>
                    {punto.descripcion}
                  </p>
                </article>
              ))}
            </div>
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
              />
            </div>

            <section
              className="mt-4 rounded-xl border px-4 py-3"
              style={{
                backgroundColor: config.extraColor2,
                borderColor: `${config.primaryColor}26`,
              }}
            >
              <div className="flex items-center justify-center gap-8">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: config.idaColor }}
                  />
                  <p className="text-sm font-medium" style={{ color: config.primaryColor }}>
                    Recorrido de ida
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: config.vueltaColor }}
                  />
                  <p className="text-sm font-medium" style={{ color: config.primaryColor }}>
                    Recorrido de vuelta
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
