import {
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import ProcesionMapWrapper from "@/components/ProcesionMapWrapper";
import PuntosInteresTimeline from "@/components/PuntosInteresTimeline";
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

            <PuntosInteresTimeline
              puntos={dataRecorrido.puntosInteres}
              fecha={dataRecorrido.fecha}
              primaryColor={config.primaryColor}
              neutralColor={config.neutralColor}
              thirdColor={config.thirdColor}
              procesionId="san-juan-de-dios"
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
                pinColor={config.thirdColor}
                procesionId="san-juan-de-dios"
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
