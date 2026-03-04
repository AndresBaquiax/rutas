"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import config from "@/data/config.json";
import logoImg from "@/assets/logoRutas.svg";

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
      .map((i) => ({ id: i.idSidebar, label: i.tituloSidebar, href: i.rutaSidebar }));

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [items, setItems] = useState<SidebarItem[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL_BACKEND}/sidebar`)
      .then((res) => res.json())
      .then((data: SidebarApiItem[]) => setItems(buildTree(data)))
      .catch(() => {});
  }, []);

  // Helper to convert hex to rgba for backgrounds/borders
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const renderItems = (itemList: SidebarItem[]) => {
    return itemList.map((item) => (
      <div key={item.id} className="relative group h-full flex items-center">
        {item.subItems && item.subItems.length > 0 ? (
          <button 
            className="px-2 lg:px-3 xl:px-4 py-2 font-medium transition-all duration-300 flex items-center gap-1.5 focus:outline-none hover:opacity-80"
            style={{ color: config.thirdColor }}
          >
            <span className="uppercase tracking-wide text-xs lg:text-sm">{item.label}</span>
            <span 
              className="text-[10px] transform transition-transform duration-300 group-hover:rotate-180"
              aria-hidden="true"
            >
              ▼
            </span>
          </button>
        ) : (
          <Link
            href={item.href}
            className="px-2 lg:px-3 xl:px-4 py-2 font-medium transition-all duration-300 block hover:opacity-80 relative"
            style={{ color: config.thirdColor }}
          >
            <span className="uppercase tracking-wide text-xs lg:text-sm relative z-10">{item.label}</span>
            <span 
              className="absolute bottom-0 left-1/2 w-0 h-[2px] -translate-x-1/2 transition-all duration-300 group-hover:w-4/5"
              style={{ backgroundColor: config.thirdColor }}
            ></span>
          </Link>
        )}

        {/* Dropdown Menu */}
        {item.subItems && item.subItems.length > 0 && (
          <div 
            className="absolute left-0 top-full mt-2 w-56 shadow-2xl rounded-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top -translate-y-2 group-hover:translate-y-0 z-50 border-t-2"
            style={{ 
              backgroundColor: config.secondaryColor, 
              borderColor: config.thirdColor 
            }}
          >
            <div className="py-2">
              {item.subItems.map((subItem) => (
                <Link
                  key={subItem.id}
                  href={subItem.href}
                  className="block px-6 py-3 text-sm transition-colors hover:pl-8 duration-200"
                  style={{ color: config.thirdColor }}
                >
                  <span className="border-l-2 border-transparent hover:border-current pl-2 transition-all block opacity-80 hover:opacity-100">
                     {subItem.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    ));
  };

  return (
    <header 
      className="w-full fixed top-0 z-50 transition-all duration-500 ease-in-out px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-2 sm:py-3 md:py-4"
    >
      <div 
        className="w-full mx-auto px-3 sm:px-4 md:px-6 h-16 sm:h-18 md:h-20 rounded-full shadow-2xl backdrop-blur-md"
        style={{ 
          backgroundColor: `${config.headerColor}dd`,
          border: `1px solid ${config.thirdColor}40`,
          boxShadow: `0 8px 32px 0 ${config.thirdColor}1A`
        }}
      >
        <div className="flex items-center justify-between h-full">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 md:gap-4 ml-4 sm:ml-5 md:ml-6">
            {/* Logo Image */}
            <img 
              src={logoImg.src}
              alt="Logo" 
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16"
            />
            {/* Text */}
            <div className="flex flex-col">
              <h1 
                className="text-base sm:text-lg md:text-xl lg:text-2xl font-serif font-bold tracking-tight leading-tight"
              style={{ color: config.thirdColor }}
              >
                Recorridos
              </h1>
              <p 
                className="text-base sm:text-lg md:text-xl lg:text-2xl font-serif font-bold tracking-tight leading-tight"
                style={{ color: config.thirdColor }}
              >
                Procesionales
              </p>
            </div>
          </Link>

          {/* Navigation Section - Desktop */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 h-full">
            {renderItems(items)}
          </nav>

          {/* Hamburger Menu Button - Mobile */}
          <button
            className="md:hidden flex flex-col gap-1.5 w-8 h-8 justify-center items-center focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block h-0.5 w-6 transition-all duration-300 ${
                isMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
              style={{ backgroundColor: config.thirdColor }}
            ></span>
            <span
              className={`block h-0.5 w-6 transition-all duration-300 ${
                isMenuOpen ? "opacity-0" : ""
              }`}
              style={{ backgroundColor: config.thirdColor }}
            ></span>
            <span
              className={`block h-0.5 w-6 transition-all duration-300 ${
                isMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
              style={{ backgroundColor: config.thirdColor }}
            ></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className="md:hidden mx-2 sm:mx-4 mt-2 rounded-3xl overflow-hidden transition-all duration-300 shadow-2xl border backdrop-blur-sm"
          style={{ 
            backgroundColor: `${config.headerColor}f5`,
            borderColor: `${config.thirdColor}30`
          }}
        >
        <nav className="px-6 py-4 space-y-2">
          {items.map((item) => (
            <div key={item.id}>
              {item.subItems && item.subItems.length > 0 ? (
                <div>
                  <button
                    className="w-full px-4 py-2 font-medium uppercase tracking-wide text-sm flex items-center justify-between"
                    style={{ color: config.thirdColor }}
                    onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                  >
                    <span>{item.label}</span>
                    <span 
                      className={`text-[10px] transform transition-transform duration-300 ${
                        expandedItem === item.id ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </button>
                  {expandedItem === item.id && (
                    <div className="pl-4 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.id}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm transition-colors"
                          style={{ color: config.thirdColor }}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className="block px-4 py-2 font-medium uppercase tracking-wide text-sm transition-colors"
                  style={{ color: config.thirdColor }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
      )}
    </header>
  );
}
