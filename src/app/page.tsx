"use client";
import config from "@/data/config.json";
import dataProcesion from "@/data/dataProcesion.json";
import Link from "next/link";
import {
  CalendarDaysIcon,
  ClockIcon,
  FireIcon,
  MapPinIcon,
  PaintBrushIcon,
  PlusIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

export default function Home() {
  const alturaTarjetas = "min-h-[350px]";
  const [tarjetaHover, setTarjetaHover] = useState<number | null>(null);
  const [tarjetaProcesionHover, setTarjetaProcesionHover] = useState<
    number | null
  >(null);
  const [imagenesCarrusel, setImagenesCarrusel] = useState<string[]>([]);
  const [indiceCarrusel, setIndiceCarrusel] = useState(0);
  const [filtroFecha, setFiltroFecha] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tradiciones = [
    {
      id: 1,
      titulo: "Las Andas",
      descripcion:
        "Imponentes plataformas de madera tallada que portan las imágenes sagradas, algunas pesan más de 3 toneladas y son cargadas por hasta 120 cucuruchos.",
      Icono: PlusIcon,
    },
    {
      id: 2,
      titulo: "Los Cucuruchos",
      descripcion:
        "Devotos vestidos con túnicas moradas que cargan las andas procesionales como acto de penitencia y fe durante la Cuaresma.",
      Icono: UserGroupIcon,
    },
    {
      id: 3,
      titulo: "Las Alfombras",
      descripcion:
        "Obras de arte efímeras elaboradas con aserrín teñido, flores y frutas que adornan las calles por donde pasan las procesiones.",
      Icono: PaintBrushIcon,
    },
    {
      id: 4,
      titulo: "El Incienso",
      descripcion:
        "El humo aromático del copal y el incienso crea una atmósfera mística que acompaña el paso solemne de las procesiones.",
      Icono: FireIcon,
    },
  ];

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

  useEffect(() => {
    const cargarImagenesCarrusel = async () => {
      try {
        const respuesta = await fetch("/api/carrusel-fotos");
        const imagenes = (await respuesta.json()) as string[];
        setImagenesCarrusel(imagenes);
      } catch {
        setImagenesCarrusel([]);
      }
    };

    cargarImagenesCarrusel();
  }, []);

  useEffect(() => {
    if (imagenesCarrusel.length <= 1) {
      return;
    }

    const temporizadorCarrusel = setInterval(() => {
      setIndiceCarrusel(
        (indiceAnterior) => (indiceAnterior + 1) % imagenesCarrusel.length,
      );
    }, 5000);

    return () => clearInterval(temporizadorCarrusel);
  }, [imagenesCarrusel.length]);

  const imagenesHero =
    imagenesCarrusel.length > 0 ? imagenesCarrusel : ["/carruselFotos/1.jpg"];

  return (
    <main style={{ backgroundColor: config.primaryColor }}>
      {/* 1ra seccion */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          {imagenesHero.map((imagen, indice) => (
            <div
              key={imagen}
              className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
              style={{
                backgroundImage: `url(${imagen})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                opacity:
                  indice === indiceCarrusel % imagenesHero.length ? 1 : 0,
              }}
            ></div>
          ))}
        </div>

        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${config.primaryColor}33 25%, ${config.primaryColor}80 40%, ${config.primaryColor}CC 60%, ${config.primaryColor} 100%)`,
          }}
        ></div>

        <div className="relative z-10 text-center px-6 max-w-4xl pt-32 lg:pt-0">
          <p
            className="text-sm uppercase tracking-widest mb-4 font-medium px-6 py-3 rounded-full inline-block"
            style={{
              color: config.thirdColor,
              background: `linear-gradient(90deg, ${config.primaryColor}00 0%, ${config.primaryColor}E6 50%, ${config.primaryColor}00 100%)`,
            }}
          >
            Tradición y Fe
          </p>

          <h1
            className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight"
            style={{ color: config.neutralColor }}
          >
            Procesiones de
            <br />
            <span style={{ color: config.thirdColor }}>Semana Santa</span>
            <br />
            Quetzaltenango
          </h1>

          <p
            className="text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ color: config.neutralColor, opacity: 0.9 }}
          >
            Descubre la riqueza cultural y espiritual de las procesiones
            cuaresmales más impresionantes de América Latina. Una tradición que
            une fe, arte y devoción.
          </p>

          <p
            className="text-xs uppercase tracking-widest mb-6"
            style={{ color: config.thirdColor, opacity: 0.8 }}
          >
            Explorar
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link
              href="#recorridos-procesionales"
              className="px-8 py-4 rounded-sm font-medium text-base uppercase tracking-wide transition-all duration-300 hover:opacity-90 w-full md:w-auto text-center"
              style={{
                backgroundColor: config.thirdColor,
                color: config.secondaryColor,
              }}
            >
              Ver Recorridos
            </Link>
            <Link
              href="/recorridos-gt/calendario"
              className="px-8 py-4 rounded-sm font-medium text-base uppercase tracking-wide transition-all duration-300 hover:opacity-90 w-full md:w-auto text-center"
              style={{
                backgroundColor: "transparent",
                color: config.thirdColor,
                border: `2px solid ${config.thirdColor}`,
              }}
            >
              Ver calendario
            </Link>
          </div>
        </div>
      </section>

      {/* 2da seccion */}
      <section id="tradiciones-cuaresma" className="w-full py-20">
        <div className="w-full max-w-[1920px] mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p
              className="text-sm uppercase tracking-[0.35em] mb-4"
              style={{ color: config.thirdColor }}
            >
              Patrimonio Cultural
            </p>
            <h2
              className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-6"
              style={{ color: config.neutralColor }}
            >
              Tradiciones de{" "}
              <span style={{ color: config.thirdColor }}>Cuaresma</span>
            </h2>
            <p
              className="text-lg"
              style={{ color: `${config.neutralColor}B3` }}
            >
              Las procesiones guatemaltecas son reconocidas mundialmente por su
              solemnidad, arte y profunda expresión de fe católica.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {tradiciones.map((item) => (
              <article
                key={item.id}
                onMouseEnter={() => setTarjetaHover(item.id)}
                onMouseLeave={() => setTarjetaHover(null)}
                className={`rounded-2xl p-8 border h-full ${alturaTarjetas} transition-all duration-300 cursor-pointer`}
                style={{
                  borderColor:
                    tarjetaHover === item.id
                      ? config.thirdColor
                      : `${config.neutralColor}14`,
                  boxShadow:
                    tarjetaHover === item.id
                      ? `0 0 25px ${config.thirdColor}4D`
                      : "none",
                  transform:
                    tarjetaHover === item.id
                      ? "translateY(-8px)"
                      : "translateY(0)",
                  background: `linear-gradient(135deg, ${config.neutralColor}08 0%, ${config.neutralColor}05 100%)`,
                }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${config.thirdColor}1F` }}
                  >
                    <item.Icono
                      className="w-7 h-7"
                      style={{ color: config.thirdColor }}
                    />
                  </div>
                  <h3
                    className="text-2xl font-serif font-semibold"
                    style={{ color: config.neutralColor }}
                  >
                    {item.titulo}
                  </h3>
                </div>
                <p
                  className="text-xl leading-relaxed"
                  style={{ color: `${config.neutralColor}B3` }}
                >
                  {item.descripcion}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3ra seccion */}
      <section
        id="recorridos-procesionales"
        className="w-full py-20"
        style={{ backgroundColor: config.secondaryColor }}
      >
        <div className="w-full max-w-[1920px] mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p
              className="text-sm uppercase tracking-[0.35em] mb-4"
              style={{ color: config.thirdColor }}
            >
              Explora Guatemala
            </p>
            <h2
              className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-6"
              style={{ color: config.neutralColor }}
            >
              Recorridos{" "}
              <span style={{ color: config.thirdColor }}>Procesionales</span>
            </h2>
            <p
              className="text-lg"
              style={{ color: `${config.neutralColor}B3` }}
            >
              Conoce las rutas de las procesiones más importantes en diferentes
              regiones del país.
            </p>
          </div>

          {/* MENÚ DESPLEGABLE DE FILTRO DE FECHAS */}
          <div className="flex justify-center items-center mb-10 relative z-20">
            {config.fechas && config.fechas.length > 0 && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  onBlur={() => setTimeout(() => setIsMenuOpen(false), 200)}
                  className="flex items-center justify-between px-6 py-3 text-sm font-semibold uppercase tracking-wider rounded-xl transition-all duration-300 outline-none cursor-pointer w-[280px] md:w-[340px]"
                  style={{
                    color: config.thirdColor,
                    backgroundColor: isMenuOpen ? `${config.thirdColor}1A` : `${config.secondaryColor}E6`,
                    border: `1px solid ${config.thirdColor}40`,
                    backdropFilter: "blur(8px)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isMenuOpen) e.currentTarget.style.backgroundColor = `${config.thirdColor}1A`;
                  }}
                  onMouseLeave={(e) => {
                    if (!isMenuOpen) e.currentTarget.style.backgroundColor = `${config.secondaryColor}E6`;
                  }}
                >
                  <span className="truncate pr-3">
                    {!filtroFecha 
                      ? "Todas las fechas" 
                      : (config.fechas.find(f => f.fecha === filtroFecha) 
                          ? config.fechas.find(f => f.fecha === filtroFecha)!.nombreFecha 
                          : "Fechas")}
                  </span>
                  
                  <ChevronRightIcon 
                    className={`h-4 w-4 transition-transform duration-300 flex-shrink-0 ${isMenuOpen ? "-rotate-90" : "rotate-90"}`} 
                  />
                </button>

                <div
                  className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[280px] md:w-[340px] rounded-xl border overflow-hidden transition-all duration-300 z-50 ${
                    isMenuOpen ? "opacity-100 translate-y-0 pointer-events-auto shadow-2xl" : "opacity-0 -translate-y-2 pointer-events-none"
                  }`}
                  style={{
                    backgroundColor: `${config.secondaryColor}FC`,
                    backdropFilter: "blur(12px)",
                    borderColor: `${config.thirdColor}40`,
                    boxShadow: isMenuOpen ? `0 10px 40px -10px ${config.thirdColor}66` : "none"
                  }}
                >
                  <div 
                    className="max-h-[300px] overflow-y-auto custom-scrollbar flex flex-col py-2"
                    style={{ "--scroll-thumb-color": config.thirdColor } as React.CSSProperties}
                  >
                    <button
                      onClick={() => {
                        setFiltroFecha(null);
                        setIsMenuOpen(false);
                      }}
                      className="text-left px-6 py-3 text-sm font-serif transition-colors relative"
                      style={{ color: !filtroFecha ? config.thirdColor : config.neutralColor }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${config.thirdColor}1A`;
                        e.currentTarget.style.color = config.thirdColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = !filtroFecha ? config.thirdColor : config.neutralColor;
                      }}
                    >
                      Todas las fechas
                    </button>
                    
                    <div className="w-full h-px my-1 opacity-20" style={{ backgroundColor: config.thirdColor }}></div>
                    
                    {config.fechas.map((f) => {
                      const isSelectedOption = filtroFecha === f.fecha;
                      return (
                        <button
                          key={f.nombreFecha}
                          onClick={() => {
                            setFiltroFecha(f.fecha);
                            setIsMenuOpen(false);
                          }}
                          className="text-left px-6 py-3 text-sm font-serif transition-colors relative"
                          style={{ color: isSelectedOption ? config.thirdColor : config.neutralColor }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = `${config.thirdColor}1A`;
                            e.currentTarget.style.color = config.thirdColor;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.color = isSelectedOption ? config.thirdColor : config.neutralColor;
                          }}
                        >
                          {f.nombreFecha}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="w-full flex flex-wrap items-stretch justify-center gap-6 relative z-10">
            {(() => {
              const procesionesFiltradas = [...dataProcesion.procesiones]
                .filter((procesion) => {
                  const hoy = new Date();
                  const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;
                  const esFuturo = procesion.fechaProcesion >= hoyStr;
                  const pasaFiltro = filtroFecha ? procesion.fechaProcesion === filtroFecha : true;
                  return esFuturo && pasaFiltro;
                })
                .sort(
                  (a, b) =>
                    new Date(a.fechaProcesion).getTime() -
                    new Date(b.fechaProcesion).getTime()
                );

              if (procesionesFiltradas.length === 0) {
                return (
                  <div className="w-full py-20 flex justify-center items-center">
                    <p
                      className="text-2xl md:text-3xl lg:text-4xl font-serif italic text-center px-4"
                      style={{ color: config.thirdColor }}
                    >
                      No hay procesiones programadas para el día de hoy.
                    </p>
                  </div>
                );
              }

              return procesionesFiltradas.map((procesion) => (
              <article
                key={procesion.idProcesion}
                onMouseEnter={() =>
                  setTarjetaProcesionHover(procesion.idProcesion)
                }
                onMouseLeave={() => setTarjetaProcesionHover(null)}
                className={`w-full md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333%-1rem)] max-w-[520px] rounded-2xl border p-6 flex flex-col ${alturaTarjetas} transition-all duration-300 cursor-pointer`}
                style={{
                  borderColor:
                    tarjetaProcesionHover === procesion.idProcesion
                      ? config.thirdColor
                      : `${config.neutralColor}14`,
                  boxShadow:
                    tarjetaProcesionHover === procesion.idProcesion
                      ? `0 0 25px ${config.thirdColor}4D`
                      : "none",
                  transform:
                    tarjetaProcesionHover === procesion.idProcesion
                      ? "translateY(-8px)"
                      : "translateY(0)",
                  background: `linear-gradient(135deg, ${config.neutralColor}08 0%, ${config.neutralColor}05 100%)`,
                }}
              >
                <h3
                  className="text-3xl font-serif font-semibold mb-2"
                  style={{ color: config.neutralColor }}
                >
                  {procesion.nombreProcesion}
                </h3>

                <div
                  className="flex items-center gap-2 mb-6"
                  style={{ color: `${config.neutralColor}B3` }}
                >
                  <MapPinIcon
                    className="w-5 h-5"
                    style={{ color: config.thirdColor }}
                  />
                  <p className="text-lg">{procesion.iglesiaProcesion}</p>
                </div>

                <div
                  className="grid grid-cols-3 gap-3 py-4 border-y mb-5"
                  style={{ borderColor: `${config.neutralColor}14` }}
                >
                  <div className="text-center">
                    <ClockIcon
                      className="w-5 h-5 mx-auto mb-2"
                      style={{ color: config.thirdColor }}
                    />
                    <p
                      className="text-sm"
                      style={{ color: `${config.neutralColor}99` }}
                    >
                      Duración
                    </p>
                    <p
                      className="text-base font-semibold"
                      style={{ color: config.neutralColor }}
                    >
                      {procesion.duracionProcesion}
                    </p>
                  </div>
                  <div className="text-center">
                    <UserGroupIcon
                      className="w-5 h-5 mx-auto mb-2"
                      style={{ color: config.thirdColor }}
                    />
                    <p
                      className="text-sm"
                      style={{ color: `${config.neutralColor}99` }}
                    >
                      Cargadores
                    </p>
                    <p
                      className="text-base font-semibold"
                      style={{ color: config.neutralColor }}
                    >
                      {procesion.cantidadCargadores}
                    </p>
                  </div>
                  <div className="text-center">
                    <CalendarDaysIcon
                      className="w-5 h-5 mx-auto mb-2"
                      style={{ color: config.thirdColor }}
                    />
                    <p
                      className="text-sm"
                      style={{ color: `${config.neutralColor}99` }}
                    >
                      Fecha
                    </p>
                    <p
                      className="text-base font-semibold"
                      style={{ color: config.neutralColor }}
                    >
                      {formatearFecha(procesion.fechaProcesion)}
                    </p>
                  </div>
                </div>

                <p
                  className="text-lg leading-relaxed"
                  style={{ color: `${config.neutralColor}B3` }}
                >
                  {procesion.descripcionProcesion}
                </p>

                {procesion.ruta ? (
                  <Link
                    href={procesion.ruta}
                    className="mt-auto pt-6 inline-flex flex-col items-start text-lg font-semibold"
                    style={{ color: config.thirdColor }}
                  >
                    <span className="inline-flex items-center gap-2 transition-opacity duration-300 hover:opacity-80">
                      Ver puntos del recorrido{" "}
                      <span aria-hidden="true">&gt;</span>
                    </span>
                    <span
                      className="h-[1px] mt-1 transition-all duration-300"
                      style={{
                        backgroundColor: config.thirdColor,
                        width:
                          tarjetaProcesionHover === procesion.idProcesion
                            ? "100%"
                            : "0%",
                      }}
                    ></span>
                  </Link>
                ) : (
                  <div
                    className="mt-auto pt-6 inline-flex flex-col items-start text-base font-medium opacity-60"
                    style={{ color: config.neutralColor }}
                  >
                    <span className="inline-flex items-center gap-2 cursor-not-allowed">
                      Pendiente de confirmar recorrido
                    </span>
                  </div>
                )}
              </article>
            ));
            })()}
          </div>
        </div>
      </section>
    </main>
  );
}
