"use client";

import { useState } from "react";
import Link from "next/link";
import config from "@/data/config.json";
import logoImg from "@/assets/logoRutas.svg";

interface SidebarItem {
  id: string;
  label: string;
  href: string;
  subItems?: SidebarItem[];
}

interface SidebarProps {
  items: SidebarItem[];
}

export default function Sidebar({ items }: SidebarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

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
            className="px-4 py-2 font-medium transition-all duration-300 flex items-center gap-1.5 focus:outline-none hover:opacity-80"
            style={{ color: config.thirdColor }}
          >
            <span className="uppercase tracking-wide text-sm">{item.label}</span>
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
            className="px-4 py-2 font-medium transition-all duration-300 block hover:opacity-80 relative"
            style={{ color: config.thirdColor }}
          >
            <span className="uppercase tracking-wide text-sm relative z-10">{item.label}</span>
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
      className="w-full shadow-xl fixed top-0 z-50 transition-all duration-500 ease-in-out"
      style={{ 
        backgroundColor: config.primaryColor,
        borderBottom: `1px solid ${config.thirdColor}40`
      }}
    >
      <div className="w-full max-w-7xl mx-auto px-6 h-20">
        <div className="flex items-center justify-between h-full">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-4">
            {/* Logo Image */}
            <img 
              src={logoImg.src}
              alt="Logo" 
              width="64" 
              height="64" 
              style={{ width: "64px", height: "64px" }}
            />
            {/* Text */}
            <div className="flex flex-col">
              <h1 
                className="text-2xl font-serif font-bold tracking-tight"
              style={{ color: config.thirdColor }}
              >
                Recorridos
              </h1>
              <p 
                className="text-2xl font-serif font-bold tracking-tight"
                style={{ color: config.thirdColor }}
              >
                Procesionales
              </p>
            </div>
          </Link>

          {/* Navigation Section - Desktop */}
          <nav className="hidden md:flex items-center gap-2 h-full">
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
          className="md:hidden overflow-hidden transition-all duration-300"
          style={{ backgroundColor: config.primaryColor }}
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
