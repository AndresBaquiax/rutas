"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { MapPinIcon, ClockIcon } from "@heroicons/react/24/outline";
import data from "@/data/actividades.json";
import config from "@/data/config.json";
import { formatearHora12 } from "@/lib/date-format";

interface Actividad {
  nombreActividad: string;
  fechaActividad: string;
  slugActividad: string;
  horaActividad?: string;
}

interface FechaEspecial {
  nombreFecha: string;
  fecha: string;
}

const actividades: Actividad[] = (data.actividades || []) as Actividad[];
const fechasEspeciales: FechaEspecial[] = (data.fechas || []) as FechaEspecial[];

const nombresVisuales: Record<string, string> = {
  domingoDeRamos: "Domingo de Ramos",
  lunesSanto: "Lunes Santo",
  martesSanto: "Martes Santo",
  miercolesSanto: "Miércoles Santo",
  juevesSanto: "Jueves Santo",
  viernesSanto: "Viernes Santo",
  sabadoDeGloria: "Sábado de Gloria",
  domingoDeResurreccion: "Domingo de Resurrección"
};

const DAYS_OF_WEEK = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export default function CalendarioPage() {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Attempt to start on the month where we have the first activity if running this exact example
    const defaultDate = new Date("2026-03-23T12:00:00");
    setCurrentDate(defaultDate);
    setSelectedDate(defaultDate);
  }, []);

  if (!currentDate) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: config.primaryColor }}
      >
        <div className="animate-pulse flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12 mb-4"
            style={{ color: config.thirdColor }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
            />
          </svg>
          <div
            className="h-4 rounded w-32"
            style={{ backgroundColor: `${config.thirdColor}4D` }}
          ></div>
        </div>
      </div>
    );
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));

  const getActividadesForDate = (date: Date) => {
    const dateString = formatDate(date);
    return actividades.filter((a) => a.fechaActividad === dateString);
  };

  const actividadesDelDiaSeleccionado = selectedDate
    ? getActividadesForDate(selectedDate)
    : [];

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <main
      className="min-h-screen relative flex flex-col justify-start overflow-hidden pt-36 pb-16 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: config.primaryColor }}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: "url(/images/fondoQuetgo.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${config.primaryColor}33 25%, ${config.primaryColor}80 40%, ${config.primaryColor}CC 60%, ${config.primaryColor} 100%)`,
          }}
        ></div>
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div className="text-center mb-14 mt-4 px-4">
          <p
            className="text-sm uppercase tracking-widest mb-4 font-medium px-6 py-3 rounded-full inline-block"
            style={{
              color: config.thirdColor,
              background: `linear-gradient(90deg, ${config.primaryColor}00 0%, ${config.primaryColor}E6 50%, ${config.primaryColor}00 100%)`,
            }}
          >
            Planifica tu Recorrido
          </p>

          <h1
            className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight"
            style={{ color: config.neutralColor }}
          >
            Calendario de
            <br />
            <span className="italic" style={{ color: config.thirdColor }}>
              Actividades
            </span>
          </h1>

          <p
            className="text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ color: config.neutralColor, opacity: 0.9 }}
          >
            Descubre las fechas, horarios y rutas de las majestuosas procesiones
            y eventos solemnes. Selecciona un día para ver los detalles y vivir
            la devoción.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Calendar Section */}
          <div
            className="rounded-[2rem] border p-8 flex-1 h-[650px] lg:h-[700px] flex flex-col backdrop-blur-md transition-all duration-300 relative overflow-hidden"
            style={{
              backgroundColor: `${config.secondaryColor}D9`,
              borderColor: `${config.thirdColor}40`,
              boxShadow: `0 8px 32px 0 ${config.thirdColor}1A`,
            }}
          >
            {/* Subtle glow effect behind calendar */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] rounded-full blur-[100px] pointer-events-none opacity-20"
              style={{
                background: `radial-gradient(circle, ${config.thirdColor} 0%, transparent 60%)`,
              }}
            ></div>

            <div className="relative z-10 flex flex-col h-full">
              {/* Header */}
              <div
                className="flex flex-row justify-between items-center gap-2 sm:gap-4 mb-8 pb-6 border-b w-full"
                style={{ borderColor: `${config.neutralColor}14` }}
              >
                <h2
                  className="text-xl sm:text-2xl md:text-3xl font-serif font-bold capitalize flex-shrink-0"
                  style={{ color: config.neutralColor }}
                >
                  {MONTHS[month]} {year}
                </h2>
                
                <div className="flex flex-row items-center gap-2 sm:gap-4 ml-auto flex-shrink-0">
                  {/* Select Especial (Custom Menu) */}
                  {fechasEspeciales.length > 0 && (
                    <div className="relative">
                      <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        onBlur={() => setTimeout(() => setIsMenuOpen(false), 200)}
                        className="flex items-center justify-between px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-widest rounded transition-all duration-300 outline-none cursor-pointer w-[150px] sm:w-[230px]"
                        style={{
                          color: config.thirdColor,
                          backgroundColor: isMenuOpen ? `${config.thirdColor}1A` : "transparent",
                          border: `1px solid ${config.thirdColor}4D`,
                        }}
                        onMouseEnter={(e) => {
                          if (!isMenuOpen) e.currentTarget.style.backgroundColor = `${config.thirdColor}0D`;
                        }}
                        onMouseLeave={(e) => {
                          if (!isMenuOpen) e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        <span className="truncate pr-3">
                          {!selectedDate
                            ? "Día de Hoy"
                            : isToday(selectedDate)
                            ? "Día de Hoy"
                            : fechasEspeciales.some((f) => f.fecha === formatDate(selectedDate))
                            ? nombresVisuales[fechasEspeciales.find((f) => f.fecha === formatDate(selectedDate))!.nombreFecha]
                            : "Días Santos"}
                        </span>
                        
                        <ChevronRightIcon 
                          className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 flex-shrink-0 ${isMenuOpen ? "-rotate-90" : "rotate-90"}`} 
                        />
                      </button>

                      {/* Dropdown Options */}
                      <div
                        className={`absolute right-0 top-full mt-2 w-56 rounded-xl border overflow-hidden transition-all duration-300 z-50 ${
                          isMenuOpen ? "opacity-100 translate-y-0 pointer-events-auto shadow-2xl" : "opacity-0 -translate-y-2 pointer-events-none"
                        }`}
                        style={{
                          backgroundColor: `${config.secondaryColor}F2`,
                          backdropFilter: "blur(12px)",
                          borderColor: `${config.thirdColor}40`,
                          boxShadow: isMenuOpen ? `0 10px 40px -10px ${config.thirdColor}4D` : "none"
                        }}
                      >
                        <div 
                          className="max-h-[300px] overflow-y-auto custom-scrollbar flex flex-col py-2"
                          style={{ "--scroll-thumb-color": config.thirdColor } as React.CSSProperties}
                        >
                          <button
                            onClick={() => {
                              goToToday();
                              setIsMenuOpen(false);
                            }}
                            className="text-left px-5 py-3 text-sm font-serif transition-colors relative"
                            style={{ color: (selectedDate && isToday(selectedDate)) ? config.thirdColor : config.neutralColor }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = `${config.thirdColor}1A`;
                              e.currentTarget.style.color = config.thirdColor;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "transparent";
                              e.currentTarget.style.color = (selectedDate && isToday(selectedDate)) ? config.thirdColor : config.neutralColor;
                            }}
                          >
                            Día de Hoy
                          </button>
                          
                          {/* Separator line */}
                          <div className="w-full h-px my-1 opacity-20" style={{ backgroundColor: config.thirdColor }}></div>
                          
                          {fechasEspeciales.map((f) => {
                            const isSelectedOption = selectedDate && formatDate(selectedDate) === f.fecha;
                            return (
                              <button
                                key={f.nombreFecha}
                                onClick={() => {
                                  const [y, m, d] = f.fecha.split("-").map(Number);
                                  const date = new Date(y, m - 1, d, 12, 0, 0);
                                  setCurrentDate(date);
                                  setSelectedDate(date);
                                  setIsMenuOpen(false);
                                }}
                                className="text-left px-5 py-3 text-sm font-serif transition-colors relative"
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
                                {nombresVisuales[f.nombreFecha] || f.nombreFecha}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  <div
                    className="flex flex-row items-center rounded overflow-hidden flex-shrink-0"
                    style={{ border: `1px solid ${config.thirdColor}4D` }}
                  >
                    <button
                      onClick={prevMonth}
                      className="px-2 sm:px-3 py-2 transition-colors cursor-pointer hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{
                        color: config.thirdColor,
                        backgroundColor: `${config.thirdColor}1A`,
                      }}
                    >
                      <ChevronLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                    <div
                      className="w-px h-6 sm:h-8"
                      style={{ backgroundColor: `${config.thirdColor}4D` }}
                    ></div>
                    <button
                      onClick={nextMonth}
                      className="px-2 sm:px-3 py-2 transition-colors cursor-pointer hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{
                        color: config.thirdColor,
                        backgroundColor: `${config.thirdColor}1A`,
                      }}
                    >
                      <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid Header */}
              <div
                className="grid gap-2 mb-4"
                style={{ gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}
              >
                {DAYS_OF_WEEK.map((day) => (
                  <div
                    key={day}
                    className="text-center font-medium text-xs sm:text-sm py-2 uppercase tracking-[0.2em]"
                    style={{ color: `${config.neutralColor}80` }}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Grid Body */}
              <div
                className="grid gap-2 flex-1 min-h-0"
                style={{ gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}
              >
                {days.map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} className="p-1"></div>;
                  }

                  const dateActividades = getActividadesForDate(date);
                  const hasActividades = dateActividades.length > 0;
                  const isDaySelected = isSelected(date);
                  const isDayToday = isToday(date);
                  const isDayHovered = hoveredDate === date.getTime();

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(date)}
                      onMouseEnter={() => setHoveredDate(date.getTime())}
                      onMouseLeave={() => setHoveredDate(null)}
                      className="relative w-full h-full flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden group min-h-[50px]"
                      style={{
                        border: isDaySelected
                          ? `1px solid ${config.thirdColor}`
                          : isDayHovered
                            ? `1px solid ${config.thirdColor}4D`
                            : `1px solid ${config.neutralColor}08`,
                        backgroundColor: isDaySelected
                          ? `${config.thirdColor}1A`
                          : isDayHovered
                            ? `${config.thirdColor}0A`
                            : `${config.cardColor}4D`,
                        transform:
                          isDaySelected || isDayHovered
                            ? "translateY(-2px)"
                            : "translateY(0)",
                        boxShadow: isDaySelected
                          ? `0 8px 20px ${config.thirdColor}33`
                          : isDayHovered
                            ? `0 4px 12px ${config.thirdColor}1A`
                            : "none",
                      }}
                    >
                      <span
                        className={`text-sm sm:text-base lg:text-lg font-serif font-bold z-10 transition-colors duration-300`}
                        style={{
                          color:
                            isDaySelected || isDayToday
                              ? config.thirdColor
                              : config.neutralColor,
                        }}
                      >
                        {date.getDate()}
                      </span>

                      {/* Activity Indicators */}
                      {hasActividades && (
                        <div className="absolute bottom-1.5 flex gap-1 justify-center w-full z-10">
                          {dateActividades.slice(0, 3).map((_, i) => (
                            <div
                              key={i}
                              className="h-1.5 w-1.5 rounded-full"
                              style={{
                                backgroundColor: isDaySelected
                                  ? config.thirdColor
                                  : config.thirdColor,
                                boxShadow: `0 0 6px ${config.thirdColor}`,
                              }}
                            />
                          ))}
                          {dateActividades.length > 3 && (
                            <div
                              className="h-1.5 w-1.5 rounded-full opacity-50"
                              style={{ backgroundColor: config.thirdColor }}
                            />
                          )}
                        </div>
                      )}

                      {/* Today indicator border */}
                      {isDayToday && !isDaySelected && (
                        <div
                          className="absolute inset-x-2 bottom-0 h-0.5 rounded-t-lg mx-auto w-1/2 opacity-50"
                          style={{ backgroundColor: config.thirdColor }}
                        ></div>
                      )}

                      {/* Selected background glow */}
                      {isDaySelected && (
                        <div
                          className="absolute inset-0 opacity-20"
                          style={{
                            background: `radial-gradient(circle at center, ${config.thirdColor} 0%, transparent 70%)`,
                          }}
                        ></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Activities List Section */}
          <div className="w-full lg:w-[480px] flex flex-col">
            <div
              className="rounded-[2rem] border p-8 flex flex-col h-[650px] lg:h-[700px] backdrop-blur-md transition-all duration-300"
              style={{
                backgroundColor: `${config.secondaryColor}D9`,
                borderColor: `${config.thirdColor}40`,
                boxShadow: `0 8px 32px 0 ${config.thirdColor}1A`,
              }}
            >
              <h3
                className="text-2xl font-serif font-bold mb-8 flex items-center justify-between pb-6 border-b"
                style={{
                  color: config.neutralColor,
                  borderColor: `${config.neutralColor}14`,
                }}
              >
                <span className="flex items-center gap-3">
                  {selectedDate ? (
                    <>
                      Día{" "}
                      <span style={{ color: config.thirdColor }}>
                        {selectedDate.getDate()}
                      </span>
                    </>
                  ) : (
                    "Actividades"
                  )}
                </span>
                {selectedDate && actividadesDelDiaSeleccionado.length > 0 && (
                  <span
                    className="text-xs py-1.5 px-3 rounded-full font-bold flex-shrink-0 tracking-widest"
                    style={{
                      backgroundColor: `${config.thirdColor}33`,
                      color: config.thirdColor,
                      border: `1px solid ${config.thirdColor}4D`,
                    }}
                  >
                    {actividadesDelDiaSeleccionado.length} EVENTOS
                  </span>
                )}
              </h3>

              <div
                className="space-y-0 overflow-y-auto pr-3 flex-1 custom-scrollbar"
                style={
                  {
                    "--scroll-thumb-color": config.thirdColor,
                  } as React.CSSProperties
                }
              >
                {actividadesDelDiaSeleccionado.length > 0 ? (
                  actividadesDelDiaSeleccionado.map((actividad, index) => {
                    const hasSlug = Boolean(
                      actividad.slugActividad &&
                        actividad.slugActividad.trim() !== ""
                    );

                    const cardContent = (
                      <>
                        {/* Left highlight strip */}
                        <div
                          className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-2"
                          style={{ backgroundColor: config.thirdColor }}
                        ></div>

                        <div className="flex items-start justify-between">
                          <div className="flex-1 pr-4 pl-3">
                            <h4
                              className="text-lg md:text-xl font-serif font-semibold transition-colors leading-tight mb-2"
                              style={{ color: config.neutralColor }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.color =
                                  config.thirdColor)
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.color =
                                  config.neutralColor)
                              }
                            >
                              {actividad.nombreActividad}
                            </h4>
                            
                            <div className="flex flex-col gap-2 mt-3">
                              {hasSlug && (
                                <div
                                  className="flex items-center text-xs uppercase tracking-widest opacity-80"
                                  style={{ color: config.thirdColor }}
                                >
                                  <MapPinIcon className="h-4 w-4 mr-1.5 flex-shrink-0" />
                                  <span>Ver detalles</span>
                                </div>
                              )}
                              
                              {actividad.horaActividad && (
                                <div
                                  className="flex items-center text-xs uppercase tracking-widest opacity-80"
                                  style={{ color: config.thirdColor }}
                                >
                                  <ClockIcon className="h-4 w-4 mr-1.5 flex-shrink-0" />
                                  <span>{formatearHora12(actividad.horaActividad)}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {hasSlug && (
                            <div
                              className="h-10 w-10 rounded-full flex items-center justify-center transition-all duration-500 group-hover:bg-opacity-100 flex-shrink-0 mt-auto mb-auto"
                              style={{
                                backgroundColor: `${config.thirdColor}26`,
                                color: config.thirdColor,
                              }}
                            >
                              <ChevronRightIcon className="h-5 w-5 stroke-2" />
                            </div>
                          )}
                        </div>
                      </>
                    );

                    return (
                      <article
                        key={`${actividad.slugActividad || index}-${index}`}
                        className="relative pl-8 pt-3 pb-3 group"
                      >
                        {/* Timeline Dot */}
                        <span
                          className="absolute left-[3px] top-9 h-3.5 w-3.5 rounded-full transition-all duration-300 z-20 group-hover:scale-125"
                          style={{
                            backgroundColor: config.thirdColor,
                            boxShadow: `0 0 10px ${config.thirdColor}80`,
                          }}
                        />

                        {/* Timeline Line */}
                        {index < actividadesDelDiaSeleccionado.length - 1 && (
                          <span
                            className="absolute left-[9px] top-11 h-[calc(100%+6px)] w-[2px] z-10"
                            style={{ backgroundColor: `${config.thirdColor}55` }}
                          />
                        )}

                        {hasSlug ? (
                          <Link
                            href={`/recorridos-gt/calendario/${actividad.slugActividad}`}
                            className="block rounded-2xl p-5 border transition-all duration-300 cursor-pointer overflow-hidden relative group-hover:-translate-y-1"
                            style={{
                              backgroundColor: `${config.cardColor}80`,
                              borderColor: `${config.neutralColor}14`,
                              background: `linear-gradient(135deg, ${config.neutralColor}08 0%, ${config.neutralColor}02 100%)`,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = config.thirdColor;
                              e.currentTarget.style.boxShadow = `0 6px 20px ${config.thirdColor}33`;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = `${config.neutralColor}14`;
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          >
                            {cardContent}
                          </Link>
                        ) : (
                          <div
                            className="block rounded-2xl p-5 border transition-all duration-300 overflow-hidden relative group-hover:-translate-y-1"
                            style={{
                              backgroundColor: `${config.cardColor}80`,
                              borderColor: `${config.neutralColor}14`,
                              background: `linear-gradient(135deg, ${config.neutralColor}08 0%, ${config.neutralColor}02 100%)`,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = config.thirdColor;
                              e.currentTarget.style.boxShadow = `0 6px 20px ${config.thirdColor}33`;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = `${config.neutralColor}14`;
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          >
                            {cardContent}
                          </div>
                        )}
                      </article>
                    );
                  })
                ) : (
                  <div className="text-center py-12 px-4 h-full flex flex-col justify-center items-center">
                    <div className="h-24 w-24 rounded-full flex items-center justify-center mb-8 relative">
                      {/* Decorative rings */}
                      <div
                        className="absolute inset-0 rounded-full border-2 animate-pulse"
                        style={{ borderColor: `${config.thirdColor}4D` }}
                      ></div>
                      <div
                        className="absolute inset-2 rounded-full border border-dashed"
                        style={{ borderColor: `${config.thirdColor}80` }}
                      ></div>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1}
                        stroke="currentColor"
                        className="w-10 h-10"
                        style={{ color: config.thirdColor }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p
                      className="text-2xl font-serif font-medium mb-3"
                      style={{ color: config.neutralColor }}
                    >
                      Día de descanso
                    </p>
                    <p
                      className="text-base leading-relaxed px-4"
                      style={{ color: `${config.neutralColor}99` }}
                    >
                      Sin procesiones programadas para este día. Selecciona otra
                      fecha.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
