import Link from "next/link";
import logoImg from "../../public/images/logoRutas.svg";
import config from "@/data/procesiones/config.json";
import {
  EnvelopeIcon,
  MapPinIcon,
  CalendarDaysIcon,
  MapIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden pt-20 pb-10 px-4 sm:px-6 lg:px-12 border-t"
      style={{
        backgroundColor: config.footerColor,
        borderColor: `${config.thirdColor}33`,
      }}
    >
      {/* Subtle radial ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[220px] rounded-full blur-[120px] pointer-events-none opacity-15"
        style={{ backgroundColor: config.thirdColor }}
      />

      {/* Top ornamental sacred divider */}
      <div className="max-w-7xl mx-auto mb-14 flex items-center justify-center gap-4">
        <div
          className="h-px flex-1 max-w-xs opacity-35"
          style={{
            background: `linear-gradient(90deg, transparent, ${config.thirdColor})`,
          }}
        />
        <div
          className="w-2.5 h-2.5 rotate-45 border"
          style={{
            borderColor: config.thirdColor,
            backgroundColor: `${config.thirdColor}33`,
          }}
        />
        <span
          className="text-[11px] uppercase tracking-[0.35em] font-semibold px-2"
          style={{ color: config.thirdColor }}
        >
          Fe • Tradición • Patrimonio
        </span>
        <div
          className="w-2.5 h-2.5 rotate-45 border"
          style={{
            borderColor: config.thirdColor,
            backgroundColor: `${config.thirdColor}33`,
          }}
        />
        <div
          className="h-px flex-1 max-w-xs opacity-35"
          style={{
            background: `linear-gradient(270deg, transparent, ${config.thirdColor})`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 pb-14 relative z-10">
        {/* Brand Column */}
        <div className="md:col-span-5 flex flex-col items-start">
          <Link href="/" className="flex items-center gap-3.5 mb-6 group">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center p-2 border transition-transform duration-300 group-hover:scale-105"
              style={{
                backgroundColor: `${config.primaryColor}CC`,
                borderColor: `${config.thirdColor}4D`,
                boxShadow: `0 0 20px ${config.thirdColor}1F`,
              }}
            >
              <img
                src={logoImg.src}
                alt="Logo de Recorridos Procesionales"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex flex-col">
              <span
                className="text-[10px] uppercase tracking-[0.28em] font-semibold mb-0.5"
                style={{ color: config.thirdColor }}
              >
                Quetzaltenango, Guatemala
              </span>
              <div className="flex items-baseline gap-1.5">
                <p
                  className="text-2xl font-serif font-bold leading-none"
                  style={{ color: config.neutralColor }}
                >
                  Recorridos
                </p>
                <p
                  className="text-2xl font-serif italic font-semibold leading-none"
                  style={{ color: config.thirdColor }}
                >
                  Procesionales
                </p>
              </div>
            </div>
          </Link>

          <p
            className="text-sm sm:text-base leading-relaxed max-w-md mb-6"
            style={{ color: `${config.neutralColor}B3` }}
          >
            Preservando y difundiendo la solemne tradición de las procesiones
            cuaresmales, de Semana Santa y velaciones en Quetzaltenango. Una
            expresión viva de fe, arte sacro y devoción que une generaciones.
          </p>

          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs border"
            style={{
              backgroundColor: `${config.primaryColor}99`,
              borderColor: `${config.thirdColor}33`,
              color: config.thirdColor,
            }}
          >
            <SparklesIcon className="w-3.5 h-3.5" />
            <span>Patrimonio Cultural Inmaterial de la Humanidad</span>
          </div>
        </div>

        {/* Navigation Links Column */}
        <div className="md:col-span-3">
          <h3
            className="text-lg font-serif font-bold uppercase tracking-[0.18em] mb-6 flex items-center gap-2.5"
            style={{ color: config.thirdColor }}
          >
            <span
              className="w-1.5 h-1.5 rotate-45"
              style={{ backgroundColor: config.thirdColor }}
            />
            Explorar
          </h3>
          <ul className="space-y-3.5">
            <li>
              <Link
                href="/#tradiciones-cuaresma"
                className="group inline-flex items-center gap-2.5 text-sm transition-all duration-300 hover:translate-x-1"
                style={{ color: `${config.neutralColor}CC` }}
              >
                <SparklesIcon
                  className="w-4 h-4 transition-transform group-hover:scale-110"
                  style={{ color: config.thirdColor }}
                />
                <span className="group-hover:underline decoration-1 underline-offset-4">
                  Tradiciones de Cuaresma
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/#recorridos-procesionales"
                className="group inline-flex items-center gap-2.5 text-sm transition-all duration-300 hover:translate-x-1"
                style={{ color: `${config.neutralColor}CC` }}
              >
                <MapIcon
                  className="w-4 h-4 transition-transform group-hover:scale-110"
                  style={{ color: config.thirdColor }}
                />
                <span className="group-hover:underline decoration-1 underline-offset-4">
                  Recorridos Procesionales
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/recorridos-gt/calendario"
                className="group inline-flex items-center gap-2.5 text-sm transition-all duration-300 hover:translate-x-1"
                style={{ color: `${config.neutralColor}CC` }}
              >
                <CalendarDaysIcon
                  className="w-4 h-4 transition-transform group-hover:scale-110"
                  style={{ color: config.thirdColor }}
                />
                <span className="group-hover:underline decoration-1 underline-offset-4">
                  Calendario de Actividades
                </span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="md:col-span-4">
          <h3
            className="text-lg font-serif font-bold uppercase tracking-[0.18em] mb-6 flex items-center gap-2.5"
            style={{ color: config.thirdColor }}
          >
            <span
              className="w-1.5 h-1.5 rotate-45"
              style={{ backgroundColor: config.thirdColor }}
            />
            Contacto e Información
          </h3>

          <div className="space-y-4">
            <div
              className="flex items-center gap-3.5 p-3.5 rounded-xl border"
              style={{
                backgroundColor: `${config.primaryColor}80`,
                borderColor: `${config.neutralColor}14`,
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${config.thirdColor}1F` }}
              >
                <MapPinIcon
                  className="w-5 h-5"
                  style={{ color: config.thirdColor }}
                />
              </div>
              <div>
                <p
                  className="text-[11px] uppercase tracking-wider font-semibold"
                  style={{ color: `${config.neutralColor}80` }}
                >
                  Ubicación
                </p>
                <p
                  className="text-sm font-medium"
                  style={{ color: config.neutralColor }}
                >
                  Quetzaltenango, Guatemala
                </p>
              </div>
            </div>

            <a
              href="mailto:baquiax.diegoandres@gmail.com"
              className="flex items-center gap-3.5 p-3.5 rounded-xl border transition-all duration-300 hover:opacity-90"
              style={{
                backgroundColor: `${config.primaryColor}80`,
                borderColor: `${config.neutralColor}14`,
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${config.thirdColor}1F` }}
              >
                <EnvelopeIcon
                  className="w-5 h-5"
                  style={{ color: config.thirdColor }}
                />
              </div>
              <div className="min-w-0">
                <p
                  className="text-[11px] uppercase tracking-wider font-semibold"
                  style={{ color: `${config.neutralColor}80` }}
                >
                  Correo Electrónico
                </p>
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: config.neutralColor }}
                >
                  baquiax.diegoandres@gmail.com
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div
        className="max-w-7xl mx-auto pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10"
        style={{ borderColor: `${config.neutralColor}14` }}
      >
        <p
          className="text-xs text-center sm:text-left"
          style={{ color: `${config.neutralColor}99` }}
        >
          © {config.actualYear} Recorridos Procesionales GT. Todos los derechos
          reservados.
        </p>
        <p
          className="text-xs flex items-center gap-1.5"
          style={{ color: `${config.neutralColor}99` }}
        >
          <span>Desarrollado con devoción y</span>
          <span
            className="text-sm"
            style={{ color: config.thirdColor }}
            aria-label="amor"
          >
            ♥
          </span>
          <span>en Quetzaltenango, Guatemala</span>
        </p>
      </div>
    </footer>
  );
}
