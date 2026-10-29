"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDownIcon, SparklesIcon } from "@heroicons/react/24/outline";
import config from "@/data/procesiones/config.json";
import sidebarData from "@/data/procesiones/sidebar.json";
import logoImg from "../../public/images/logoRutas.svg";

interface SidebarItem {
  id: string;
  label: string;
  href: string;
  subItems?: SidebarItem[];
}

interface SidebarApiItem {
  idSidebar: string;
  tituloSidebar: string;
  rutaSidebar: string;
  parentId: string | null;
  ordenSidebar: number;
}

function buildTree(items: SidebarApiItem[]): SidebarItem[] {
  const sorted = [...items].sort((a, b) => a.ordenSidebar - b.ordenSidebar);
  const roots: SidebarItem[] = [];

  for (const item of sorted.filter((i) => i.parentId === null)) {
    const children = sorted
      .filter((i) => i.parentId === item.idSidebar)
      .map((i) => ({
        id: i.idSidebar,
        label: i.tituloSidebar,
        href: i.rutaSidebar,
      }));

    roots.push({
      id: item.idSidebar,
      label: item.tituloSidebar,
      href: item.rutaSidebar,
      ...(children.length > 0 && { subItems: children }),
    });
  }

  return roots;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [items] = useState<SidebarItem[]>(() =>
    buildTree(sidebarData as SidebarApiItem[])
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const renderDesktopItems = (itemList: SidebarItem[]) => {
    return itemList.map((item, idx) => {
      const active = isActiveLink(item.href);

      return (
        <div key={item.id} className="relative group h-full flex items-center">
          {idx > 0 && (
            <span
              className="mx-1 xl:mx-1.5 w-1 h-1 rotate-45 opacity-35 hidden 2xl:inline-block shrink-0"
              style={{ backgroundColor: config.thirdColor }}
              aria-hidden="true"
            />
          )}

          {item.subItems && item.subItems.length > 0 ? (
            <button
              type="button"
              className="px-2.5 xl:px-3.5 py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-1.5 focus:outline-none cursor-pointer"
              style={{
                color: active ? config.neutralColor : config.thirdColor,
                backgroundColor: active ? `${config.thirdColor}24` : "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${config.thirdColor}1A`;
                e.currentTarget.style.color = config.neutralColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = active
                  ? `${config.thirdColor}24`
                  : "transparent";
                e.currentTarget.style.color = active
                  ? config.neutralColor
                  : config.thirdColor;
              }}
            >
              <span className="uppercase tracking-[0.14em] text-[10px] xl:text-[11px] 2xl:text-xs font-semibold">
                {item.label}
              </span>
              <ChevronDownIcon className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" />
            </button>
          ) : (
            <Link
              href={item.href}
              className="px-2.5 xl:px-3.5 py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-1.5 relative group/link"
              style={{
                color: active ? config.neutralColor : config.thirdColor,
                backgroundColor: active ? `${config.thirdColor}22` : "transparent",
                border: active
                  ? `1px solid ${config.thirdColor}55`
                  : "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = `${config.thirdColor}14`;
                  e.currentTarget.style.color = config.neutralColor;
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = config.thirdColor;
                }
              }}
            >
              {active && (
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: config.thirdColor,
                    boxShadow: `0 0 8px ${config.thirdColor}`,
                  }}
                />
              )}
              <span className="uppercase tracking-[0.14em] text-[10px] xl:text-[11px] 2xl:text-xs font-semibold relative z-10 whitespace-nowrap">
                {item.label}
              </span>
              {!active && (
                <span
                  className="absolute bottom-1 left-1/2 w-0 h-[1.5px] -translate-x-1/2 transition-all duration-300 group-hover/link:w-3/5 rounded-full"
                  style={{ backgroundColor: config.thirdColor }}
                />
              )}
            </Link>
          )}

          {/* Dropdown Menu */}
          {item.subItems && item.subItems.length > 0 && (
            <div
              className="absolute left-0 top-full pt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top -translate-y-2 group-hover:translate-y-0 z-50"
            >
              <div
                className="rounded-2xl overflow-hidden shadow-2xl border backdrop-blur-xl py-2"
                style={{
                  backgroundColor: `${config.secondaryColor}F5`,
                  borderColor: `${config.thirdColor}4D`,
                  boxShadow: `0 20px 50px -10px rgba(0,0,0,0.7), 0 0 25px ${config.thirdColor}26`,
                }}
              >
                <div
                  className="h-0.5 w-full mb-1"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${config.thirdColor}, transparent)`,
                  }}
                />
                {item.subItems.map((subItem) => {
                  const subActive = isActiveLink(subItem.href);
                  return (
                    <Link
                      key={subItem.id}
                      href={subItem.href}
                      className="block px-5 py-2.5 text-xs uppercase tracking-wider transition-all duration-200"
                      style={{
                        color: subActive ? config.neutralColor : config.thirdColor,
                        backgroundColor: subActive
                          ? `${config.thirdColor}1F`
                          : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${config.thirdColor}1F`;
                        e.currentTarget.style.color = config.neutralColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = subActive
                          ? `${config.thirdColor}1F`
                          : "transparent";
                        e.currentTarget.style.color = subActive
                          ? config.neutralColor
                          : config.thirdColor;
                      }}
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className="w-1.5 h-1.5 rotate-45 shrink-0 transition-transform duration-200"
                          style={{ backgroundColor: config.thirdColor }}
                        />
                        <span className="leading-snug font-medium">
                          {subItem.label}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <header
      className={`w-full fixed top-0 z-50 transition-all duration-500 ease-out px-3 sm:px-5 md:px-8 lg:px-10 ${isScrolled ? "py-2" : "py-3 sm:py-4"
        }`}
    >
      <div
        className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 h-16 sm:h-18 md:h-20 rounded-2xl sm:rounded-full transition-all duration-500 backdrop-blur-xl relative overflow-visible"
        style={{
          backgroundColor: isScrolled
            ? `${config.headerColor}F0`
            : `${config.headerColor}D8`,
          border: `1px solid ${isScrolled ? `${config.thirdColor}59` : `${config.thirdColor}38`
            }`,
          boxShadow: isScrolled
            ? `0 14px 40px -8px rgba(0,0,0,0.65), 0 0 28px 0 ${config.thirdColor}22`
            : `0 8px 32px 0 rgba(0,0,0,0.4), 0 0 20px 0 ${config.thirdColor}14`,
        }}
      >
        {/* Top ornamental hairline */}
        <div
          className="absolute top-0 left-1/4 right-1/4 h-[1px] pointer-events-none opacity-60"
          style={{
            background: `linear-gradient(90deg, transparent, ${config.thirdColor}, transparent)`,
          }}
        />

        <div className="flex items-center justify-between h-full gap-4">
          {/* Logo Section */}
          <Link
            href="/"
            className="flex items-center gap-3 sm:gap-3.5 group focus:outline-none shrink-0"
          >
            <div
              className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-13 md:h-13 rounded-full flex items-center justify-center p-2 transition-transform duration-300 group-hover:scale-105"
              style={{
                backgroundColor: `${config.primaryColor}CC`,
                border: `1px solid ${config.thirdColor}55`,
                boxShadow: `0 0 16px ${config.thirdColor}26`,
              }}
            >
              <img
                src={logoImg.src}
                alt="Logo Recorridos Procesionales"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span
                  className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.28em] font-semibold opacity-85 truncate"
                  style={{ color: config.thirdColor }}
                >
                  Eventos catolicos • {config.actualYear}
                </span>
              </div>
              <div className="flex flex-wrap items-baseline gap-x-1.5 leading-tight">
                <span
                  className="text-base sm:text-xl md:text-2xl font-serif font-bold tracking-wide leading-none"
                  style={{ color: config.neutralColor }}
                >
                  Recorridos
                </span>
                <span
                  className="text-base sm:text-xl md:text-2xl font-serif italic font-semibold tracking-wide leading-none"
                  style={{ color: config.thirdColor }}
                >
                  Procesionales
                </span>
              </div>
            </div>
          </Link>

          {/* Navigation Section - Desktop */}
          <nav className="hidden xl:flex items-center gap-0.5 h-full">
            {renderDesktopItems(items)}
          </nav>

          {/* Hamburger Menu Button - Mobile */}
          <button
            type="button"
            className="xl:hidden flex flex-col gap-1.5 w-10 h-10 rounded-full justify-center items-center focus:outline-none transition-colors cursor-pointer"
            style={{
              backgroundColor: isMenuOpen
                ? `${config.thirdColor}26`
                : `${config.primaryColor}80`,
              border: `1px solid ${config.thirdColor}4D`,
            }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menú de navegación"
          >
            <span
              className={`block h-0.5 w-5 rounded-full transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              style={{ backgroundColor: config.thirdColor }}
            />
            <span
              className={`block h-0.5 w-5 rounded-full transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""
                }`}
              style={{ backgroundColor: config.thirdColor }}
            />
            <span
              className={`block h-0.5 w-5 rounded-full transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              style={{ backgroundColor: config.thirdColor }}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`xl:hidden max-w-[1800px] mx-auto mt-2.5 rounded-3xl overflow-hidden transition-all duration-300 border backdrop-blur-2xl ${isMenuOpen
            ? "max-h-[80vh] opacity-100 translate-y-0 pointer-events-auto shadow-2xl"
            : "max-h-0 opacity-0 -translate-y-3 pointer-events-none border-transparent"
          }`}
        style={{
          backgroundColor: `${config.headerColor}F8`,
          borderColor: isMenuOpen ? `${config.thirdColor}4D` : "transparent",
          boxShadow: isMenuOpen
            ? `0 24px 48px rgba(0,0,0,0.75), 0 0 30px ${config.thirdColor}22`
            : "none",
        }}
      >
        <div
          className="px-6 pt-4 pb-2 flex items-center justify-between border-b"
          style={{ borderColor: `${config.thirdColor}26` }}
        >
          <span
            className="text-[11px] uppercase tracking-[0.25em] font-semibold flex items-center gap-2"
            style={{ color: config.thirdColor }}
          >
            <SparklesIcon className="w-3.5 h-3.5" />
            Navegación Sacro-Cultural
          </span>
          <span
            className="text-[11px] font-serif italic"
            style={{ color: `${config.neutralColor}99` }}
          >
            Quetzaltenango
          </span>
        </div>

        <nav
          className="px-4 py-4 space-y-1.5 max-h-[65vh] overflow-y-auto custom-scrollbar"
          style={
            { "--scroll-thumb-color": config.thirdColor } as React.CSSProperties
          }
        >
          {items.map((item) => {
            const active = isActiveLink(item.href);

            return (
              <div key={item.id}>
                {item.subItems && item.subItems.length > 0 ? (
                  <div className="rounded-xl overflow-hidden">
                    <button
                      type="button"
                      className="w-full px-4 py-3 font-semibold uppercase tracking-[0.15em] text-xs flex items-center justify-between rounded-xl transition-colors"
                      style={{
                        color: active ? config.neutralColor : config.thirdColor,
                        backgroundColor:
                          expandedItem === item.id
                            ? `${config.thirdColor}1A`
                            : "transparent",
                      }}
                      onClick={() =>
                        setExpandedItem(
                          expandedItem === item.id ? null : item.id
                        )
                      }
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className="w-1.5 h-1.5 rotate-45"
                          style={{ backgroundColor: config.thirdColor }}
                        />
                        {item.label}
                      </span>
                      <ChevronDownIcon
                        className={`w-4 h-4 transform transition-transform duration-300 ${expandedItem === item.id ? "rotate-180" : ""
                          }`}
                      />
                    </button>
                    {expandedItem === item.id && (
                      <div
                        className="pl-6 pr-2 py-2 space-y-1 border-l ml-4 mt-1"
                        style={{ borderColor: `${config.thirdColor}40` }}
                      >
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.id}
                            href={subItem.href}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs uppercase tracking-wider transition-colors"
                            style={{
                              color: isActiveLink(subItem.href)
                                ? config.neutralColor
                                : config.thirdColor,
                              backgroundColor: isActiveLink(subItem.href)
                                ? `${config.thirdColor}22`
                                : "transparent",
                            }}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ backgroundColor: config.thirdColor }}
                            />
                            <span className="leading-snug">{subItem.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center justify-between px-4 py-3 rounded-xl font-semibold uppercase tracking-[0.15em] text-xs transition-all"
                    style={{
                      color: active ? config.neutralColor : config.thirdColor,
                      backgroundColor: active
                        ? `${config.thirdColor}24`
                        : "transparent",
                      border: active
                        ? `1px solid ${config.thirdColor}4D`
                        : "1px solid transparent",
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className="w-1.5 h-1.5 rotate-45 shrink-0"
                        style={{
                          backgroundColor: config.thirdColor,
                          boxShadow: active
                            ? `0 0 8px ${config.thirdColor}`
                            : "none",
                        }}
                      />
                      {item.label}
                    </span>
                    {active && (
                      <span
                        className="text-[10px] font-serif italic capitalize px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${config.thirdColor}33`,
                          color: config.thirdColor,
                        }}
                      >
                        Actual
                      </span>
                    )}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
