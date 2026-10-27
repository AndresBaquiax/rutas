"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import {
  MapPinIcon,
  ClockIcon,
  CalendarDaysIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import data from "@/data/procesiones/actividades.json";
import config from "@/data/procesiones/config.json";
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
const fechasEspeciales: FechaEspecial[] = (config.fechas ||
  []) as FechaEspecial[];

const DAYS_OF_WEEK = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const DAYS_FULL = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];
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
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  }, []);

  if (!currentDate) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: config.primaryColor }}
      >
        <div className="animate-pulse flex flex-col items-center">
          <CalendarDaysIcon
            className="w-12 h-12 mb-4"
            style={{ color: config.thirdColor }}
          />
          <div
            className="h-3 rounded-full w-36"
            style={{ backgroundColor: `${config.thirdColor}4D` }}
          />
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

  const days: (Date | null)[] = [];
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
      className="min-h-screen relative flex flex-col justify-start overflow-hidden pt-32 pb-24 px-4 sm:px-6 lg:px-10"
      style={{ backgroundColor: config.primaryColor }}
    >
      {/* Background Image with Multi-Layer Sacred Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: "url(/images/fotoCatedral.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.45,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 20%, ${config.primaryColor}66 0%, ${config.primaryColor}E6 70%, ${config.primaryColor} 100%)`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${config.headerColor}B3 0%, transparent 25%, ${config.primaryColor}CC 65%, ${config.primaryColor} 100%)`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Page Header */}
        <div className="text-center mb-14 mt-4 px-4">
          <div
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full mb-6 border backdrop-blur-md"
            style={{
              backgroundColor: `${config.secondaryColor}BF`,
              borderColor: `${config.thirdColor}55`,
              boxShadow: `0 0 20px ${config.thirdColor}22`,
            }}
          >
            <span
              className="w-1.5 h-1.5 rotate-45"
              style={{ backgroundColor: config.thirdColor }}
            />
            <span
              className="text-xs uppercase tracking-[0.28em] font-semibold"
              style={{ color: config.thirdColor }}
            >
              Planifica tu Recorrido
            </span>
            <span
              className="w-1.5 h-1.5 rotate-45"
              style={{ backgroundColor: config.thirdColor }}
            />
          </div>

          <h1
            className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold mb-5 leading-tight"
            style={{ color: config.neutralColor }}
          >
            Calendario de{" "}
            <span className="italic" style={{ color: config.thirdColor }}>
              Actividades
            </span>
          </h1>

          <p
            className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-light"
            style={{ color: `${config.neutralColor}D9` }}
          >
            Consulta las fechas solemnes, horarios de salida y rutas oficiales
            de las procesiones y velaciones. Selecciona cualquier día para
            explorar su programación.
          </p>
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ==================== LEFT: CALENDAR GRID ==================== */}
          <div
            className="lg:col-span-7 rounded-3xl border p-6 sm:p-8 flex flex-col backdrop-blur-xl transition-all duration-300 relative overflow-hidden"
            style={{
              backgroundColor: `${config.secondaryColor}E6`,
              borderColor: `${config.thirdColor}40`,
              boxShadow: `0 20px 50px -15px rgba(0,0,0,0.7), 0 0 30px 0 ${config.thirdColor}18`,
            }}
          >
            {/* Top Ornamental Line */}
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{
                background: `linear-gradient(90deg, transparent, ${config.thirdColor}, transparent)`,
              }}
            />

            {/* Subtle glow behind calendar */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full blur-[110px] pointer-events-none opacity-15"
              style={{
                background: `radial-gradient(circle, ${config.thirdColor} 0%, transparent 65%)`,
              }}
            />

            <div className="relative z-10 flex flex-col">
              {/* Calendar Controls Header */}
              <div
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b"
                style={{ borderColor: `${config.neutralColor}1A` }}
              >
                <div>
                  <span
                    className="text-[11px] uppercase tracking-[0.25em] font-semibold block mb-1"
                    style={{ color: config.thirdColor }}
                  >
                    Mes Seleccionado
                  </span>
                  <h2
                    className="text-3xl sm:text-4xl font-serif font-bold capitalize"
                    style={{ color: config.neutralColor }}
                  >
                    {MONTHS[month]}{" "}
                    <span
                      className="italic font-normal"
                      style={{ color: config.thirdColor }}
                    >
                      {year}
                    </span>
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
                  {/* Select Especial (Días Santos / Fechas de config.json) */}
                  {fechasEspeciales.length > 0 && (
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        onBlur={() =>
                          setTimeout(() => setIsMenuOpen(false), 200)
                        }
                        className="flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all duration-300 outline-none cursor-pointer w-[190px] sm:w-[220px]"
                        style={{
                          color: config.thirdColor,
                          backgroundColor: isMenuOpen
                            ? `${config.thirdColor}24`
                            : `${config.primaryColor}B3`,
                          border: `1px solid ${config.thirdColor}55`,
                        }}
                      >
                        <span className="truncate pr-2 flex items-center gap-1.5">
                          <SparklesIcon className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">
                            {!selectedDate
                              ? "Día de Hoy"
                              : isToday(selectedDate)
                                ? "Día de Hoy"
                                : fechasEspeciales.some(
                                      (f) =>
                                        f.fecha === formatDate(selectedDate)
                                    )
                                  ? fechasEspeciales.find(
                                      (f) =>
                                        f.fecha === formatDate(selectedDate)
                                    )!.nombreFecha
                                  : "Fechas Destacadas"}
                          </span>
                        </span>

                        <ChevronRightIcon
                          className={`h-3.5 w-3.5 transition-transform duration-300 flex-shrink-0 ${
                            isMenuOpen ? "-rotate-90" : "rotate-90"
                          }`}
                        />
                      </button>

                      {/* Dropdown Options */}
                      <div
                        className={`absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-64 sm:w-72 rounded-2xl border overflow-hidden transition-all duration-300 z-50 ${
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
                              goToToday();
                              setIsMenuOpen(false);
                            }}
                            className="text-left px-5 py-2.5 text-sm font-serif transition-colors flex items-center justify-between"
                            style={{
                              color:
                                selectedDate && isToday(selectedDate)
                                  ? config.thirdColor
                                  : config.neutralColor,
                              backgroundColor:
                                selectedDate && isToday(selectedDate)
                                  ? `${config.thirdColor}1A`
                                  : "transparent",
                            }}
                          >
                            <span>Ir al Día de Hoy</span>
                            <span
                              className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full"
                              style={{
                                backgroundColor: `${config.thirdColor}26`,
                                color: config.thirdColor,
                              }}
                            >
                              Hoy
                            </span>
                          </button>

                          <div
                            className="w-full h-px my-1 opacity-20"
                            style={{ backgroundColor: config.thirdColor }}
                          />

                          {fechasEspeciales.map((f) => {
                            const isSelectedOption =
                              selectedDate &&
                              formatDate(selectedDate) === f.fecha;
                            return (
                              <button
                                type="button"
                                key={f.nombreFecha}
                                onClick={() => {
                                  const [y, m, d] = f.fecha
                                    .split("-")
                                    .map(Number);
                                  const date = new Date(y, m - 1, d, 12, 0, 0);
                                  setCurrentDate(date);
                                  setSelectedDate(date);
                                  setIsMenuOpen(false);
                                }}
                                className="text-left px-5 py-2.5 text-sm font-serif transition-colors flex items-center justify-between gap-2"
                                style={{
                                  color: isSelectedOption
                                    ? config.thirdColor
                                    : config.neutralColor,
                                  backgroundColor: isSelectedOption
                                    ? `${config.thirdColor}1A`
                                    : "transparent",
                                }}
                              >
                                <span className="leading-snug">
                                  {f.nombreFecha}
                                </span>
                                {isSelectedOption && (
                                  <span
                                    className="w-1.5 h-1.5 rotate-45 shrink-0"
                                    style={{
                                      backgroundColor: config.thirdColor,
                                    }}
                                  />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Prev / Next Month Buttons */}
                  <div
                    className="flex items-center rounded-xl overflow-hidden shrink-0"
                    style={{
                      border: `1px solid ${config.thirdColor}55`,
                      backgroundColor: `${config.primaryColor}B3`,
                    }}
                  >
                    <button
                      type="button"
                      onClick={prevMonth}
                      aria-label="Mes anterior"
                      className="px-3 py-2.5 transition-colors cursor-pointer hover:opacity-80"
                      style={{ color: config.thirdColor }}
                    >
                      <ChevronLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={goToToday}
                      className="px-2.5 py-2 text-[11px] uppercase tracking-widest font-semibold border-x transition-colors cursor-pointer hover:opacity-80"
                      style={{
                        color: config.neutralColor,
                        borderColor: `${config.thirdColor}33`,
                      }}
                    >
                      Hoy
                    </button>
                    <button
                      type="button"
                      onClick={nextMonth}
                      aria-label="Mes siguiente"
                      className="px-3 py-2.5 transition-colors cursor-pointer hover:opacity-80"
                      style={{ color: config.thirdColor }}
                    >
                      <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Days of Week Header */}
              <div
                className="grid gap-2 mb-3"
                style={{ gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}
              >
                {DAYS_OF_WEEK.map((day) => (
                  <div
                    key={day}
                    className="text-center font-semibold text-xs py-2 uppercase tracking-[0.2em]"
                    style={{ color: `${config.thirdColor}CC` }}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days Grid */}
              <div
                className="grid gap-2 sm:gap-2.5"
                style={{ gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}
              >
                {days.map((date, index) => {
                  if (!date) {
                    return (
                      <div
                        key={`empty-${index}`}
                        className="aspect-square rounded-2xl opacity-20"
                        style={{ backgroundColor: `${config.primaryColor}40` }}
                      />
                    );
                  }

                  const dateActividades = getActividadesForDate(date);
                  const hasActividades = dateActividades.length > 0;
                  const isDaySelected = isSelected(date);
                  const isDayToday = isToday(date);
                  const isDayHovered = hoveredDate === date.getTime();

                  return (
                    <button
                      type="button"
                      key={index}
                      onClick={() => setSelectedDate(date)}
                      onMouseEnter={() => setHoveredDate(date.getTime())}
                      onMouseLeave={() => setHoveredDate(null)}
                      className="relative aspect-square flex flex-col items-center justify-center p-1.5 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden group"
                      style={{
                        border: isDaySelected
                          ? `1.5px solid ${config.thirdColor}`
                          : hasActividades
                            ? `1px solid ${config.thirdColor}55`
                            : isDayHovered
                              ? `1px solid ${config.thirdColor}40`
                              : `1px solid ${config.neutralColor}12`,
                        backgroundColor: isDaySelected
                          ? `${config.thirdColor}26`
                          : hasActividades
                            ? `${config.cardColor}B3`
                            : isDayHovered
                              ? `${config.cardColor}80`
                              : `${config.primaryColor}73`,
                        transform:
                          isDaySelected || isDayHovered
                            ? "translateY(-2px)"
                            : "translateY(0)",
                        boxShadow: isDaySelected
                          ? `0 10px 24px -4px ${config.thirdColor}40`
                          : "none",
                      }}
                    >
                      {/* Today top pill */}
                      {isDayToday && (
                        <span
                          className="absolute top-1.5 w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: config.thirdColor }}
                          title="Hoy"
                        />
                      )}

                      <span
                        className="text-base sm:text-lg md:text-xl font-serif font-bold z-10 transition-colors duration-300"
                        style={{
                          color:
                            isDaySelected || isDayToday || hasActividades
                              ? config.thirdColor
                              : config.neutralColor,
                        }}
                      >
                        {date.getDate()}
                      </span>

                      {/* Activity Indicators */}
                      {hasActividades && (
                        <div className="mt-1 flex items-center gap-1 justify-center z-10">
                          {dateActividades.slice(0, 3).map((_, i) => (
                            <span
                              key={i}
                              className="h-1.5 w-1.5 rounded-full"
                              style={{
                                backgroundColor: config.thirdColor,
                                boxShadow: `0 0 6px ${config.thirdColor}`,
                              }}
                            />
                          ))}
                          {dateActividades.length > 3 && (
                            <span
                              className="text-[9px] font-bold leading-none"
                              style={{ color: config.thirdColor }}
                            >
                              +
                            </span>
                          )}
                        </div>
                      )}

                      {/* Selected radial spotlight */}
                      {isDaySelected && (
                        <div
                          className="absolute inset-0 opacity-25 pointer-events-none"
                          style={{
                            background: `radial-gradient(circle at center, ${config.thirdColor} 0%, transparent 75%)`,
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Calendar Footer Legend */}
              <div
                className="mt-6 pt-5 border-t flex flex-wrap items-center justify-center sm:justify-between gap-4 text-xs"
                style={{
                  borderColor: `${config.neutralColor}14`,
                  color: `${config.neutralColor}B3`,
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor: config.thirdColor,
                      boxShadow: `0 0 8px ${config.thirdColor}`,
                    }}
                  />
                  <span>Día con procesión / actividad</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-md border"
                    style={{
                      borderColor: config.thirdColor,
                      backgroundColor: `${config.thirdColor}26`,
                    }}
                  />
                  <span>Día seleccionado</span>
                </div>
              </div>
            </div>
          </div>

          {/* ==================== RIGHT: SELECTED DAY AGENDA ==================== */}
          <div className="lg:col-span-5 flex flex-col">
            <div
              className="rounded-3xl border p-6 sm:p-8 flex flex-col h-[620px] lg:h-[680px] backdrop-blur-xl transition-all duration-300 relative overflow-hidden"
              style={{
                backgroundColor: `${config.secondaryColor}E6`,
                borderColor: `${config.thirdColor}40`,
                boxShadow: `0 20px 50px -15px rgba(0,0,0,0.7), 0 0 30px 0 ${config.thirdColor}18`,
              }}
            >
              {/* Top Ornamental Line */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{
                  background: `linear-gradient(90deg, transparent, ${config.thirdColor}, transparent)`,
                }}
              />

              {/* Agenda Header */}
              <div
                className="pb-5 mb-6 border-b flex items-start justify-between gap-4"
                style={{ borderColor: `${config.neutralColor}1A` }}
              >
                <div>
                  <span
                    className="text-[11px] uppercase tracking-[0.25em] font-semibold block mb-1"
                    style={{ color: config.thirdColor }}
                  >
                    {selectedDate
                      ? DAYS_FULL[selectedDate.getDay()]
                      : "Programación"}
                  </span>
                  <h3
                    className="text-2xl sm:text-3xl font-serif font-bold"
                    style={{ color: config.neutralColor }}
                  >
                    {selectedDate ? (
                      <>
                        <span style={{ color: config.thirdColor }}>
                          {selectedDate.getDate()}
                        </span>{" "}
                        de {MONTHS[selectedDate.getMonth()]}
                      </>
                    ) : (
                      "Actividades"
                    )}
                  </h3>
                </div>

                {selectedDate && (
                  <span
                    className="text-[11px] py-1.5 px-3.5 rounded-full font-bold shrink-0 tracking-widest uppercase border"
                    style={{
                      backgroundColor:
                        actividadesDelDiaSeleccionado.length > 0
                          ? `${config.thirdColor}26`
                          : `${config.primaryColor}80`,
                      color:
                        actividadesDelDiaSeleccionado.length > 0
                          ? config.thirdColor
                          : `${config.neutralColor}99`,
                      borderColor:
                        actividadesDelDiaSeleccionado.length > 0
                          ? `${config.thirdColor}55`
                          : `${config.neutralColor}1F`,
                    }}
                  >
                    {actividadesDelDiaSeleccionado.length}{" "}
                    {actividadesDelDiaSeleccionado.length === 1
                      ? "Evento"
                      : "Eventos"}
                  </span>
                )}
              </div>

              {/* Scrollable Timeline List */}
              <div
                className="space-y-1 overflow-y-auto pr-2 flex-1 custom-scrollbar"
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

                    const cardInner = (
                      <>
                        {/* Left Highlight Bar */}
                        <div
                          className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-1.5"
                          style={{ backgroundColor: config.thirdColor }}
                        />

                        <div className="flex items-center justify-between gap-3 pl-2">
                          <div className="flex-1 min-w-0">
                            {actividad.horaActividad && (
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider mb-2"
                                style={{
                                  backgroundColor: `${config.thirdColor}22`,
                                  color: config.thirdColor,
                                }}
                              >
                                <ClockIcon className="h-3.5 w-3.5 shrink-0" />
                                <span>
                                  {formatearHora12(actividad.horaActividad)}
                                </span>
                              </div>
                            )}

                            <h4
                              className="text-lg sm:text-xl font-serif font-bold leading-snug mb-2 transition-colors"
                              style={{ color: config.neutralColor }}
                            >
                              {actividad.nombreActividad}
                            </h4>

                            {hasSlug && (
                              <div
                                className="inline-flex items-center text-xs uppercase tracking-[0.18em] font-semibold mt-1"
                                style={{ color: config.thirdColor }}
                              >
                                <MapPinIcon className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                                <span>Ver recorrido y mapa</span>
                              </div>
                            )}
                          </div>

                          {hasSlug && (
                            <div
                              className="h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 shrink-0 border"
                              style={{
                                backgroundColor: `${config.thirdColor}1F`,
                                borderColor: `${config.thirdColor}4D`,
                                color: config.thirdColor,
                              }}
                            >
                              <ChevronRightIcon className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                      </>
                    );

                    return (
                      <article
                        key={`${actividad.slugActividad || index}-${index}`}
                        className="relative pl-7 py-2.5 group"
                      >
                        {/* Timeline Diamond Node */}
                        <span
                          className="absolute left-[3px] top-8 h-3 w-3 rotate-45 transition-all duration-300 z-20 group-hover:scale-125"
                          style={{
                            backgroundColor: config.thirdColor,
                            boxShadow: `0 0 10px ${config.thirdColor}80`,
                          }}
                        />

                        {/* Timeline Connecting Line */}
                        {index < actividadesDelDiaSeleccionado.length - 1 && (
                          <span
                            className="absolute left-[8px] top-10 h-[calc(100%+4px)] w-[1.5px] z-10"
                            style={{
                              backgroundColor: `${config.thirdColor}40`,
                            }}
                          />
                        )}

                        {hasSlug ? (
                          <Link
                            href={`${actividad.slugActividad}`}
                            className="block rounded-2xl p-4 sm:p-5 border transition-all duration-300 cursor-pointer overflow-hidden relative group-hover:-translate-y-0.5"
                            style={{
                              backgroundColor: `${config.cardColor}B3`,
                              borderColor: `${config.neutralColor}1A`,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor =
                                config.thirdColor;
                              e.currentTarget.style.boxShadow = `0 10px 25px -5px ${config.thirdColor}33`;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = `${config.neutralColor}1A`;
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          >
                            {cardInner}
                          </Link>
                        ) : (
                          <div
                            className="block rounded-2xl p-4 sm:p-5 border transition-all duration-300 overflow-hidden relative"
                            style={{
                              backgroundColor: `${config.cardColor}80`,
                              borderColor: `${config.neutralColor}14`,
                            }}
                          >
                            {cardInner}
                          </div>
                        )}
                      </article>
                    );
                  })
                ) : (
                  <div className="text-center py-12 px-4 h-full flex flex-col justify-center items-center">
                    <div className="h-20 w-20 rounded-full flex items-center justify-center mb-6 relative">
                      <div
                        className="absolute inset-0 rounded-full border animate-pulse"
                        style={{ borderColor: `${config.thirdColor}4D` }}
                      />
                      <div
                        className="absolute inset-2 rounded-full border border-dashed"
                        style={{ borderColor: `${config.thirdColor}80` }}
                      />
                      <CalendarDaysIcon
                        className="w-8 h-8"
                        style={{ color: config.thirdColor }}
                      />
                    </div>

                    <p
                      className="text-2xl font-serif font-bold mb-2"
                      style={{ color: config.neutralColor }}
                    >
                      Sin cortejos programados
                    </p>
                    <p
                      className="text-sm leading-relaxed max-w-xs mb-6"
                      style={{ color: `${config.neutralColor}99` }}
                    >
                      No hay procesiones ni velaciones registradas para esta
                      fecha. Selecciona un día marcado en el calendario.
                    </p>

                    {fechasEspeciales.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const f = fechasEspeciales[0];
                          const [y, m, d] = f.fecha.split("-").map(Number);
                          const date = new Date(y, m - 1, d, 12, 0, 0);
                          setCurrentDate(date);
                          setSelectedDate(date);
                        }}
                        className="px-5 py-2.5 rounded-xl text-xs uppercase tracking-widest font-semibold transition-opacity hover:opacity-90 cursor-pointer"
                        style={{
                          backgroundColor: `${config.thirdColor}26`,
                          color: config.thirdColor,
                          border: `1px solid ${config.thirdColor}55`,
                        }}
                      >
                        Ir a próxima fecha destacada
                      </button>
                    )}
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
