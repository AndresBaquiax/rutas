"use client";

import config from "@/data/procesiones/config.json";
import dataProcesion from "@/data/procesiones/dataProcesion.json";
import Link from "next/link";
import {
  CalendarDaysIcon,
  ClockIcon,
  FireIcon,
  MapPinIcon,
  PaintBrushIcon,
  PlusIcon,
  UserGroupIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

export default function Home() {
  const [tarjetaHover, setTarjetaHover] = useState<number | null>(null);
  const [tarjetaProcesionHover, setTarjetaProcesionHover] = useState<
    number | null
  >(null);
  const [imagenesCarrusel, setImagenesCarrusel] = useState<string[]>([]);
  const [indiceCarrusel, setIndiceCarrusel] = useState(0);
  const [filtroFecha, setFiltroFecha] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tradiciones = [
    {
      id: 1,
      romano: "I",
      subtitulo: "Arte en Madera",
      titulo: "Las Andas",
      descripcion:
        "Imponentes plataformas de madera tallada que portan las imágenes sagradas, algunas pesan más de 3 toneladas y son cargadas por hasta 120 cucuruchos.",
      Icono: PlusIcon,
    },
    {
      id: 2,
      romano: "II",
      subtitulo: "Penitencia y Devoción",
      titulo: "Los Cucuruchos",
      descripcion:
        "Devotos vestidos con túnicas moradas o de riguroso luto que cargan las andas procesionales como acto de penitencia y fe durante la Cuaresma y Semana Santa.",
      Icono: UserGroupIcon,
    },
    {
      id: 3,
      romano: "III",
      subtitulo: "Ofrenda Efímera",
      titulo: "Las Alfombras",
      descripcion:
        "Obras de arte efímeras elaboradas con aserrín teñido, pino, flores y frutas que engalanan las calles al paso solemne de los cortejos procesionales.",
      Icono: PaintBrushIcon,
    },
    {
      id: 4,
      romano: "IV",
      subtitulo: "Atmósfera Sacra",
      titulo: "El Incienso",
      descripcion:
        "El humo aromático del copal y el incienso purifica el ambiente y crea una atmósfera mística que acompaña el paso solemne de las procesiones.",
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
        (indiceAnterior) => (indiceAnterior + 1) % imagenesCarrusel.length
      );
    }, 5500);

    return () => clearInterval(temporizadorCarrusel);
  }, [imagenesCarrusel.length]);

  const imagenesHero =
    imagenesCarrusel.length > 0 ? imagenesCarrusel : ["/carruselFotos/1.webp"];

  return (
    <main style={{ backgroundColor: config.primaryColor }}>
      {/* ==================== 1RA SECCIÓN: HERO SOLEMNE ==================== */}
      <section className="min-h-screen flex flex-col justify-between relative overflow-hidden pt-28 pb-12 px-4 sm:px-6 lg:px-12">
        {/* Carousel Background Images */}
        <div className="absolute inset-0 z-0">
          {imagenesHero.map((imagen, indice) => {
            const activa = indice === indiceCarrusel % imagenesHero.length;
            return (
              <div
                key={imagen}
                className="absolute inset-0 transition-all duration-[1800ms] ease-out"
                style={{
                  backgroundImage: `url(${imagen})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  opacity: activa ? 1 : 0,
                  transform: activa ? "scale(1.05)" : "scale(1)",
                }}
              />
            );
          })}
        </div>

        {/* Multi-layer Sacred Vignette & Gradient Overlay */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background: `radial-gradient(circle at 50% 35%, ${config.primaryColor}4D 0%, ${config.primaryColor}BF 65%, ${config.primaryColor}F5 100%)`,
          }}
        />
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background: `linear-gradient(180deg, ${config.headerColor}B3 0%, transparent 25%, ${config.primaryColor}99 65%, ${config.primaryColor} 100%)`,
          }}
        />

        {/* Top spacer for navbar alignment */}
        <div className="relative z-10" />

        {/* Center Hero Content */}
        <div className="relative z-10 text-center w-full max-w-5xl mx-auto my-auto py-12">
          {/* Sacred Ornamental Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full mb-8 border backdrop-blur-md"
            style={{
              backgroundColor: `${config.secondaryColor}BF`,
              borderColor: `${config.thirdColor}55`,
              boxShadow: `0 0 25px ${config.thirdColor}22`,
            }}
          >
            <span
              className="w-1.5 h-1.5 rotate-45"
              style={{ backgroundColor: config.thirdColor }}
            />
            <span
              className="text-xs sm:text-sm uppercase tracking-[0.3em] font-semibold"
              style={{ color: config.thirdColor }}
            >
              Tradición, Fe y Devoción
            </span>
            <span
              className="w-1.5 h-1.5 rotate-45"
              style={{ backgroundColor: config.thirdColor }}
            />
          </div>

          <h1
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 leading-[1.05] tracking-tight"
            style={{ color: config.neutralColor }}
          >
            Procesiones de
            <span
              className="block italic font-semibold my-1 sm:my-2"
              style={{
                color: config.thirdColor,
                textShadow: `0 4px 30px ${config.thirdColor}40`,
              }}
            >
              Semana Santa
            </span>
            <span className="block text-3xl sm:text-5xl md:text-6xl font-medium tracking-wide mt-2 opacity-95">
              {dataProcesion.departamento || "Quetzaltenango"}
            </span>
          </h1>

          {/* Ornamental Divider */}
          <div className="flex items-center justify-center gap-3 my-7">
            <div
              className="h-px w-16 sm:w-28 opacity-50"
              style={{
                background: `linear-gradient(90deg, transparent, ${config.thirdColor})`,
              }}
            />
            <SparklesIcon
              className="w-5 h-5"
              style={{ color: config.thirdColor }}
            />
            <div
              className="h-px w-16 sm:w-28 opacity-50"
              style={{
                background: `linear-gradient(270deg, transparent, ${config.thirdColor})`,
              }}
            />
          </div>

          <p
            className="text-base sm:text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed font-light"
            style={{ color: `${config.neutralColor}E6` }}
          >
            Descubre la riqueza cultural, histórica y espiritual de los cortejos
            procesionales y velaciones más solemnes. Una tradición centenaria
            que une fe, arte sacro y devoción.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto max-w-md sm:max-w-none mx-auto">
            <Link
              href="#recorridos-procesionales"
              className="group px-8 py-4 rounded-xl font-semibold text-sm uppercase tracking-[0.2em] transition-all duration-300 hover:-translate-y-0.5 w-full sm:w-auto inline-flex items-center justify-center gap-3 shadow-xl"
              style={{
                backgroundColor: config.thirdColor,
                color: config.secondaryColor,
                boxShadow: `0 10px 30px -5px ${config.thirdColor}66`,
              }}
            >
              <span>Ver Recorridos</span>
              <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/recorridos-gt/calendario"
              className="group px-8 py-4 rounded-xl font-semibold text-sm uppercase tracking-[0.2em] transition-all duration-300 hover:-translate-y-0.5 w-full sm:w-auto inline-flex items-center justify-center gap-3 backdrop-blur-md"
              style={{
                backgroundColor: `${config.secondaryColor}99`,
                color: config.thirdColor,
                border: `1.5px solid ${config.thirdColor}80`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${config.thirdColor}22`;
                e.currentTarget.style.borderColor = config.thirdColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `${config.secondaryColor}99`;
                e.currentTarget.style.borderColor = `${config.thirdColor}80`;
              }}
            >
              <CalendarDaysIcon className="w-4 h-4" />
              <span>Ver Calendario</span>
            </Link>
          </div>
        </div>

        {/* Bottom Hero Bar: Carousel Indicators & Scroll Hint */}
        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t"
          style={{ borderColor: `${config.neutralColor}1A` }}
        >
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em]"
            style={{ color: `${config.neutralColor}99` }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: config.thirdColor }}
            />
            <span>Cuaresma, Semana Santa y Velaciones • {config.actualYear}</span>
          </div>

          {imagenesHero.length > 1 && (
            <div className="flex items-center gap-1.5">
              {imagenesHero.slice(0, 8).map((_, idx) => {
                const activeDot =
                  (indiceCarrusel % imagenesHero.length) % 8 === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Imagen ${idx + 1}`}
                    onClick={() => setIndiceCarrusel(idx)}
                    className="h-1.5 rounded-full transition-all duration-500 cursor-pointer"
                    style={{
                      width: activeDot ? "28px" : "8px",
                      backgroundColor: activeDot
                        ? config.thirdColor
                        : `${config.neutralColor}40`,
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ==================== 2DA SECCIÓN: TRADICIONES DE CUARESMA ==================== */}
      <section
        id="tradiciones-cuaresma"
        className="w-full py-24 lg:py-32 relative overflow-hidden"
        style={{ backgroundColor: config.primaryColor }}
      >
        {/* Subtle ambient background glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-[160px] pointer-events-none opacity-10"
          style={{ backgroundColor: config.thirdColor }}
        />

        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-3 mb-4">
              <div
                className="h-px w-10"
                style={{ backgroundColor: config.thirdColor }}
              />
              <p
                className="text-xs sm:text-sm uppercase tracking-[0.35em] font-semibold"
                style={{ color: config.thirdColor }}
              >
                Patrimonio Cultural
              </p>
              <div
                className="h-px w-10"
                style={{ backgroundColor: config.thirdColor }}
              />
            </div>

            <h2
              className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold leading-tight mb-6"
              style={{ color: config.neutralColor }}
            >
              Tradiciones de{" "}
              <span className="italic" style={{ color: config.thirdColor }}>
                Cuaresma
              </span>
            </h2>

            <p
              className="text-base sm:text-lg leading-relaxed"
              style={{ color: `${config.neutralColor}B3` }}
            >
              Las procesiones guatemaltecas son reconocidas mundialmente por su
              solemnidad, arte sacro y profunda expresión de fe y devoción
              popular.
            </p>
          </div>

          {/* 4 Museum-grade Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
            {tradiciones.map((item) => {
              const isHovered = tarjetaHover === item.id;
              return (
                <article
                  key={item.id}
                  onMouseEnter={() => setTarjetaHover(item.id)}
                  onMouseLeave={() => setTarjetaHover(null)}
                  className="group relative rounded-3xl p-8 border flex flex-col justify-between min-h-[340px] transition-all duration-500 overflow-hidden"
                  style={{
                    borderColor: isHovered
                      ? config.thirdColor
                      : `${config.thirdColor}26`,
                    boxShadow: isHovered
                      ? `0 20px 45px -15px rgba(0,0,0,0.6), 0 0 30px ${config.thirdColor}33`
                      : `0 10px 30px -15px rgba(0,0,0,0.4)`,
                    transform: isHovered ? "translateY(-8px)" : "translateY(0)",
                    background: `linear-gradient(160deg, ${config.cardColor}B3 0%, ${config.secondaryColor}E6 100%)`,
                  }}
                >
                  {/* Top Ornamental Line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${config.thirdColor}, transparent)`,
                      opacity: isHovered ? 1 : 0.35,
                    }}
                  />

                  {/* Subtle Watermark Roman Numeral */}
                  <span
                    className="absolute -right-2 -top-4 font-serif text-8xl font-bold select-none pointer-events-none transition-all duration-500"
                    style={{
                      color: config.thirdColor,
                      opacity: isHovered ? 0.14 : 0.06,
                    }}
                  >
                    {item.romano}
                  </span>

                  <div>
                    {/* Icon & Subtitle Row */}
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-transform duration-500 group-hover:scale-110"
                        style={{
                          backgroundColor: `${config.thirdColor}1A`,
                          borderColor: `${config.thirdColor}4D`,
                          boxShadow: isHovered
                            ? `0 0 20px ${config.thirdColor}33`
                            : "none",
                        }}
                      >
                        <item.Icono
                          className="w-7 h-7"
                          style={{ color: config.thirdColor }}
                        />
                      </div>

                      <span
                        className="text-[11px] uppercase tracking-[0.22em] font-semibold px-3 py-1 rounded-full border"
                        style={{
                          color: config.thirdColor,
                          borderColor: `${config.thirdColor}33`,
                          backgroundColor: `${config.primaryColor}80`,
                        }}
                      >
                        {item.subtitulo}
                      </span>
                    </div>

                    <h3
                      className="text-2xl sm:text-3xl font-serif font-bold mb-4 transition-colors duration-300"
                      style={{
                        color: isHovered
                          ? config.thirdColor
                          : config.neutralColor,
                      }}
                    >
                      {item.titulo}
                    </h3>

                    <p
                      className="text-base leading-relaxed"
                      style={{ color: `${config.neutralColor}CC` }}
                    >
                      {item.descripcion}
                    </p>
                  </div>

                  {/* Bottom Ornamental Accent */}
                  <div className="pt-6 mt-6 border-t flex items-center justify-between"
                    style={{ borderColor: `${config.neutralColor}14` }}
                  >
                    <span
                      className="text-xs font-serif italic"
                      style={{ color: `${config.neutralColor}80` }}
                    >
                      Tradición Quetzalteca
                    </span>
                    <span
                      className="w-2 h-2 rotate-45 transition-transform duration-300 group-hover:scale-125"
                      style={{ backgroundColor: config.thirdColor }}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== 3RA SECCIÓN: RECORRIDOS PROCESIONALES ==================== */}
      <section
        id="recorridos-procesionales"
        className="w-full py-24 lg:py-32 relative border-t"
        style={{
          backgroundColor: config.secondaryColor,
          borderColor: `${config.thirdColor}26`,
        }}
      >
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div
                className="h-px w-10"
                style={{ backgroundColor: config.thirdColor }}
              />
              <p
                className="text-xs sm:text-sm uppercase tracking-[0.35em] font-semibold"
                style={{ color: config.thirdColor }}
              >
                Explora {dataProcesion.departamento || "Quetzaltenango"}
              </p>
              <div
                className="h-px w-10"
                style={{ backgroundColor: config.thirdColor }}
              />
            </div>

            <h2
              className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold leading-tight mb-6"
              style={{ color: config.neutralColor }}
            >
              Recorridos{" "}
              <span className="italic" style={{ color: config.thirdColor }}>
                Procesionales
              </span>
            </h2>

            <p
              className="text-base sm:text-lg leading-relaxed"
              style={{ color: `${config.neutralColor}B3` }}
            >
              Conoce los horarios, templos y rutas oficiales de los cortejos
              procesionales y velaciones programados en la ciudad.
            </p>
          </div>

          {/* BARRA DE FILTROS: FECHAS (config.fechas) + BUSCADOR */}
          <div className="max-w-4xl mx-auto mb-14 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-20">
            {/* Search Input */}
            <div
              className="relative w-full sm:flex-1 max-w-md rounded-xl border overflow-hidden transition-all duration-300"
              style={{
                backgroundColor: `${config.primaryColor}B3`,
                borderColor: `${config.thirdColor}40`,
              }}
            >
              <MagnifyingGlassIcon
                className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: config.thirdColor }}
              />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar procesión o templo..."
                className="w-full pl-12 pr-4 py-3.5 text-sm bg-transparent outline-none placeholder:opacity-60"
                style={{ color: config.neutralColor }}
              />
              {busqueda && (
                <button
                  type="button"
                  onClick={() => setBusqueda("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-0.5 rounded-full cursor-pointer"
                  style={{
                    backgroundColor: `${config.thirdColor}26`,
                    color: config.thirdColor,
                  }}
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* Dropdown de Fechas de config.json */}
            {config.fechas && config.fechas.length > 0 && (
              <div className="relative w-full sm:w-auto flex justify-center">
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  onBlur={() => setTimeout(() => setIsMenuOpen(false), 200)}
                  className="flex items-center justify-between px-5 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-xl transition-all duration-300 outline-none cursor-pointer w-full sm:w-[320px]"
                  style={{
                    color: config.thirdColor,
                    backgroundColor: isMenuOpen
                      ? `${config.thirdColor}22`
                      : `${config.primaryColor}B3`,
                    border: `1px solid ${config.thirdColor}55`,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <span className="flex items-center gap-2.5 truncate pr-3">
                    <CalendarDaysIcon className="w-4 h-4 shrink-0" />
                    <span className="truncate">
                      {!filtroFecha
                        ? "Todas las fechas"
                        : config.fechas.find((f) => f.fecha === filtroFecha)
                          ? config.fechas.find((f) => f.fecha === filtroFecha)!
                              .nombreFecha
                          : "Fechas"}
                    </span>
                  </span>

                  <ChevronRightIcon
                    className={`h-4 w-4 transition-transform duration-300 flex-shrink-0 ${
                      isMenuOpen ? "-rotate-90" : "rotate-90"
                    }`}
                  />
                </button>

                <div
                  className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 w-full sm:w-[340px] rounded-2xl border overflow-hidden transition-all duration-300 z-50 ${
                    isMenuOpen
                      ? "opacity-100 translate-y-0 pointer-events-auto shadow-2xl"
                      : "opacity-0 -translate-y-2 pointer-events-none"
                  }`}
                  style={{
                    backgroundColor: `${config.headerColor}FA`,
                    backdropFilter: "blur(16px)",
                    borderColor: `${config.thirdColor}55`,
                    boxShadow: isMenuOpen
                      ? `0 20px 50px -10px rgba(0,0,0,0.8), 0 0 25px ${config.thirdColor}33`
                      : "none",
                  }}
                >
                  <div
                    className="max-h-[300px] overflow-y-auto custom-scrollbar flex flex-col py-2"
                    style={
                      {
                        "--scroll-thumb-color": config.thirdColor,
                      } as React.CSSProperties
                    }
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setFiltroFecha(null);
                        setIsMenuOpen(false);
                      }}
                      className="text-left px-6 py-3 text-sm font-serif transition-colors relative flex items-center justify-between"
                      style={{
                        color: !filtroFecha
                          ? config.thirdColor
                          : config.neutralColor,
                        backgroundColor: !filtroFecha
                          ? `${config.thirdColor}14`
                          : "transparent",
                      }}
                    >
                      <span>Todas las fechas</span>
                      {!filtroFecha && (
                        <span
                          className="w-1.5 h-1.5 rotate-45"
                          style={{ backgroundColor: config.thirdColor }}
                        />
                      )}
                    </button>

                    <div
                      className="w-full h-px my-1 opacity-20"
                      style={{ backgroundColor: config.thirdColor }}
                    />

                    {config.fechas.map((f) => {
                      const isSelectedOption = filtroFecha === f.fecha;
                      return (
                        <button
                          type="button"
                          key={f.nombreFecha}
                          onClick={() => {
                            setFiltroFecha(f.fecha);
                            setIsMenuOpen(false);
                          }}
                          className="text-left px-6 py-3 text-sm font-serif transition-colors relative flex items-center justify-between gap-2"
                          style={{
                            color: isSelectedOption
                              ? config.thirdColor
                              : config.neutralColor,
                            backgroundColor: isSelectedOption
                              ? `${config.thirdColor}14`
                              : "transparent",
                          }}
                        >
                          <span className="leading-snug">{f.nombreFecha}</span>
                          {isSelectedOption && (
                            <span
                              className="w-1.5 h-1.5 rotate-45 shrink-0"
                              style={{ backgroundColor: config.thirdColor }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* GRID DE TARJETAS DE PROCESIONES */}
          <div className="w-full flex flex-wrap items-stretch justify-center gap-6 lg:gap-8 relative z-10">
            {(() => {
              const termino = busqueda.trim().toLowerCase();
              const procesionesFiltradas = [...dataProcesion.procesiones]
                .filter((procesion) => {
                  const hoy = new Date();
                  const hoyStr = `${hoy.getFullYear()}-${String(
                    hoy.getMonth() + 1
                  ).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;
                  const esFuturo = procesion.fechaProcesion >= hoyStr;
                  const pasaFiltro = filtroFecha
                    ? procesion.fechaProcesion === filtroFecha
                    : true;
                  const pasaBusqueda = termino
                    ? procesion.nombreProcesion
                        .toLowerCase()
                        .includes(termino) ||
                      procesion.iglesiaProcesion
                        .toLowerCase()
                        .includes(termino) ||
                      procesion.descripcionProcesion
                        .toLowerCase()
                        .includes(termino)
                    : true;
                  return esFuturo && pasaFiltro && pasaBusqueda;
                })
                .sort(
                  (a, b) =>
                    new Date(a.fechaProcesion).getTime() -
                    new Date(b.fechaProcesion).getTime()
                );

              if (procesionesFiltradas.length === 0) {
                return (
                  <div
                    className="w-full max-w-2xl mx-auto py-16 px-8 rounded-3xl border text-center flex flex-col items-center"
                    style={{
                      backgroundColor: `${config.primaryColor}80`,
                      borderColor: `${config.thirdColor}33`,
                    }}
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-5 border"
                      style={{
                        backgroundColor: `${config.thirdColor}1A`,
                        borderColor: `${config.thirdColor}4D`,
                      }}
                    >
                      <CalendarDaysIcon
                        className="w-8 h-8"
                        style={{ color: config.thirdColor }}
                      />
                    </div>
                    <p
                      className="text-2xl md:text-3xl font-serif italic mb-3"
                      style={{ color: config.thirdColor }}
                    >
                      No hay procesiones programadas para esta selección.
                    </p>
                    <p
                      className="text-sm sm:text-base max-w-md mb-6"
                      style={{ color: `${config.neutralColor}99` }}
                    >
                      Intenta cambiar el filtro de fecha o consulta el calendario
                      completo de actividades cuaresmales y de velación.
                    </p>
                    {(filtroFecha || busqueda) && (
                      <button
                        type="button"
                        onClick={() => {
                          setFiltroFecha(null);
                          setBusqueda("");
                        }}
                        className="px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest font-semibold cursor-pointer transition-opacity hover:opacity-90"
                        style={{
                          backgroundColor: config.thirdColor,
                          color: config.primaryColor,
                        }}
                      >
                        Mostrar todas las fechas
                      </button>
                    )}
                  </div>
                );
              }

              return procesionesFiltradas.map((procesion) => {
                const isHovered =
                  tarjetaProcesionHover === procesion.idProcesion;

                return (
                  <article
                    key={procesion.idProcesion}
                    onMouseEnter={() =>
                      setTarjetaProcesionHover(procesion.idProcesion)
                    }
                    onMouseLeave={() => setTarjetaProcesionHover(null)}
                    className="w-full md:w-[calc(50%-1rem)] xl:w-[calc(33.333%-1.35rem)] max-w-[520px] rounded-3xl border p-7 flex flex-col justify-between transition-all duration-500 relative overflow-hidden group"
                    style={{
                      borderColor: isHovered
                        ? config.thirdColor
                        : `${config.thirdColor}26`,
                      boxShadow: isHovered
                        ? `0 22px 48px -12px rgba(0,0,0,0.65), 0 0 28px ${config.thirdColor}2E`
                        : `0 10px 30px -10px rgba(0,0,0,0.4)`,
                      transform: isHovered
                        ? "translateY(-8px)"
                        : "translateY(0)",
                      background: `linear-gradient(155deg, ${config.cardColor}CC 0%, ${config.primaryColor}F2 100%)`,
                    }}
                  >
                    {/* Top Ornamental Highlight Bar */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${config.thirdColor}, transparent)`,
                        opacity: isHovered ? 1 : 0.3,
                      }}
                    />

                    <div>
                      {/* Top Meta Ribbon */}
                      <div className="flex items-center justify-between gap-2 mb-5">
                        <span
                          className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] font-semibold px-3 py-1 rounded-full border"
                          style={{
                            color: config.thirdColor,
                            backgroundColor: `${config.thirdColor}1A`,
                            borderColor: `${config.thirdColor}40`,
                          }}
                        >
                          <CalendarDaysIcon className="w-3.5 h-3.5" />
                          {formatearFecha(procesion.fechaProcesion)}
                        </span>

                        <span
                          className="w-2 h-2 rotate-45 shrink-0"
                          style={{ backgroundColor: config.thirdColor }}
                        />
                      </div>

                      {/* Procession Title */}
                      <h3
                        className="text-2xl sm:text-3xl font-serif font-bold leading-snug mb-3 transition-colors duration-300"
                        style={{
                          color: isHovered
                            ? config.thirdColor
                            : config.neutralColor,
                        }}
                      >
                        {procesion.nombreProcesion}
                      </h3>

                      {/* Church Name */}
                      <div
                        className="flex items-center gap-2 mb-6"
                        style={{ color: `${config.neutralColor}CC` }}
                      >
                        <MapPinIcon
                          className="w-5 h-5 shrink-0"
                          style={{ color: config.thirdColor }}
                        />
                        <p className="text-sm sm:text-base font-medium">
                          {procesion.iglesiaProcesion}
                        </p>
                      </div>

                      {/* 3-Column Metrics Box */}
                      <div
                        className="grid grid-cols-3 gap-2 p-3.5 rounded-2xl border mb-6"
                        style={{
                          backgroundColor: `${config.secondaryColor}B3`,
                          borderColor: `${config.neutralColor}14`,
                        }}
                      >
                        <div className="text-center px-1">
                          <ClockIcon
                            className="w-4 h-4 mx-auto mb-1.5"
                            style={{ color: config.thirdColor }}
                          />
                          <p
                            className="text-[10px] uppercase tracking-wider mb-0.5"
                            style={{ color: `${config.neutralColor}80` }}
                          >
                            Duración
                          </p>
                          <p
                            className="text-xs sm:text-sm font-semibold leading-tight"
                            style={{ color: config.neutralColor }}
                          >
                            {procesion.duracionProcesion}
                          </p>
                        </div>

                        <div
                          className="text-center px-1 border-x"
                          style={{ borderColor: `${config.neutralColor}14` }}
                        >
                          <UserGroupIcon
                            className="w-4 h-4 mx-auto mb-1.5"
                            style={{ color: config.thirdColor }}
                          />
                          <p
                            className="text-[10px] uppercase tracking-wider mb-0.5"
                            style={{ color: `${config.neutralColor}80` }}
                          >
                            Cargadores
                          </p>
                          <p
                            className="text-xs sm:text-sm font-semibold leading-tight"
                            style={{ color: config.neutralColor }}
                          >
                            {procesion.cantidadCargadores}
                          </p>
                        </div>

                        <div className="text-center px-1">
                          <CalendarDaysIcon
                            className="w-4 h-4 mx-auto mb-1.5"
                            style={{ color: config.thirdColor }}
                          />
                          <p
                            className="text-[10px] uppercase tracking-wider mb-0.5"
                            style={{ color: `${config.neutralColor}80` }}
                          >
                            Año
                          </p>
                          <p
                            className="text-xs sm:text-sm font-semibold leading-tight"
                            style={{ color: config.neutralColor }}
                          >
                            {procesion.fechaProcesion.slice(0, 4)}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <p
                        className="text-sm sm:text-base leading-relaxed line-clamp-4"
                        style={{ color: `${config.neutralColor}B8` }}
                      >
                        {procesion.descripcionProcesion}
                      </p>
                    </div>

                    {/* Action Footer */}
                    <div className="mt-7 pt-5 border-t"
                      style={{ borderColor: `${config.neutralColor}14` }}
                    >
                      {procesion.ruta ? (
                        <Link
                          href={procesion.ruta}
                          className="w-full py-3.5 px-5 rounded-xl font-semibold text-xs sm:text-sm uppercase tracking-[0.16em] inline-flex items-center justify-between transition-all duration-300"
                          style={{
                            backgroundColor: isHovered
                              ? config.thirdColor
                              : `${config.thirdColor}1A`,
                            color: isHovered
                              ? config.secondaryColor
                              : config.thirdColor,
                            border: `1px solid ${config.thirdColor}55`,
                          }}
                        >
                          <span>Ver puntos del recorrido</span>
                          <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                      ) : (
                        <div
                          className="w-full py-3.5 px-5 rounded-xl text-xs uppercase tracking-[0.16em] font-medium flex items-center justify-center border opacity-60 cursor-not-allowed"
                          style={{
                            color: config.neutralColor,
                            borderColor: `${config.neutralColor}22`,
                            backgroundColor: `${config.secondaryColor}66`,
                          }}
                        >
                          <span>Pendiente de confirmar recorrido</span>
                        </div>
                      )}
                    </div>
                  </article>
                );
              });
            })()}
          </div>
        </div>
      </section>
    </main>
  );
}
