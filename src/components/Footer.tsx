import logoImg from "@/assets/logoRutas.svg";
import { EnvelopeIcon, MapPinIcon, PhoneIcon } from "@heroicons/react/24/outline";

export default async function Footer() {
  let config: Record<string, string> = {};
  try {
    const res = await fetch(`${process.env.API_URL_BACKEND}/configuraciones`);
    const items: Array<{ idConfigurations: number; name: string; value: string }> = await res.json();
    config = Object.fromEntries(items.map(({ name, value }) => [name, value]));
  } catch {
    // API no disponible en build time
  }
  return (
    <footer
      className="px-3 sm:px-4 md:px-6 lg:px-8 pt-16 pb-8"
      style={{ backgroundColor: config.footerColor }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <img
              src={logoImg.src}
              alt="Logo de Recorridos procesionales"
              className="w-12 h-12 md:w-14 md:h-14 object-contain"
            />

            <div className="flex flex-col">
              <p className="text-xl font-serif font-semibold leading-tight" style={{ color: config.neutralColor }}>
                Recorridos
              </p>
              <p className="text-xl font-serif font-semibold leading-tight" style={{ color: config.thirdColor }}>
                Procesionales
              </p>
            </div>
          </div>

          <p className="text-base leading-relaxed max-w-md" style={{ color: `${config.neutralColor}B3` }}>
            Preservando y difundiendo la rica tradición de las procesiones cuaresmales guatemaltecas. Una expresión única de fe, arte y cultura que une a generaciones.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-serif font-semibold mb-5" style={{ color: config.neutralColor }}>
            Enlaces
          </h3>
          <ul className="space-y-3">
            <li>
              <a href="/#tradiciones-cuaresma" className="text-sm transition-opacity duration-300 hover:opacity-80" style={{ color: `${config.neutralColor}CC` }}>
                Tradiciones
              </a>
            </li>
            <li>
              <a href="/#recorridos-procesionales" className="text-sm transition-opacity duration-300 hover:opacity-80" style={{ color: `${config.neutralColor}CC` }}>
                Recorridos
              </a>
            </li>
            <li>
              <a href="https://www.guatemalahoy.co/calendario-de-la-semana-santa-en-guatemala-2026/" className="text-sm transition-opacity duration-300 hover:opacity-80" style={{ color: `${config.neutralColor}CC` }}>
                Calendario
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-serif font-semibold mb-5" style={{ color: config.neutralColor }}>
            Contacto
          </h3>

          <div className="space-y-4" style={{ color: `${config.neutralColor}CC` }}>
            <div className="flex items-center gap-3 text-sm">
              <MapPinIcon className="w-5 h-5" style={{ color: config.thirdColor }} />
              <span>Quetzaltenango, Guatemala</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <EnvelopeIcon className="w-5 h-5" style={{ color: config.thirdColor }} />
              <span>baquiax.diegoandres@gmail.com</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px mb-8" style={{ backgroundColor: `${config.neutralColor}1A` }}></div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <p className="text-xs" style={{ color: `${config.neutralColor}B3` }}>
          © {config.actualYear} Recorridos procesionales. Todos los derechos reservados.
        </p>
        <p className="text-xs flex items-center gap-2" style={{ color: `${config.neutralColor}B3` }}>
          Hecho con <span style={{ color: config.thirdColor }}>♥</span> en Guatemala
        </p>
      </div>
    </footer>
  );
}