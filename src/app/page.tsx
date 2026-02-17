"use client";
import bgImage from "@/assets/main/1.jpg";
import config from "@/data/config.json";
import {
  FireIcon,
  PaintBrushIcon,
  PlusIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useState } from 'react';

export default function Home() {
  
  const alturaTarjetas = "min-h-[350px]"; 
  const [tarjetaHover, setTarjetaHover] = useState<number | null>(null);

  const tradiciones = [
    {
      id: 1,
      titulo: "Las Andas",
      descripcion: "Imponentes plataformas de madera tallada que portan las imágenes sagradas, algunas pesan más de 3 toneladas y son cargadas por hasta 120 cucuruchos.",
      Icono: PlusIcon
    },
    {
      id: 2,
      titulo: "Los Cucuruchos",
      descripcion: "Devotos vestidos con túnicas moradas que cargan las andas procesionales como acto de penitencia y fe durante la Cuaresma.",
      Icono: UserGroupIcon
    },
    {
      id: 3,
      titulo: "Las Alfombras",
      descripcion: "Obras de arte efímeras elaboradas con aserrín teñido, flores y frutas que adornan las calles por donde pasan las procesiones.",
      Icono: PaintBrushIcon
    },
    {
      id: 4,
      titulo: "El Incienso",
      descripcion: "El humo aromático del copal y el incienso crea una atmósfera mística que acompaña el paso solemne de las procesiones.",
      Icono: FireIcon
    }
  ];

  return (
    <main style={{ backgroundColor: config.primaryColor }}>
      <section
        className="min-h-screen flex items-center justify-center relative"
        style={{
          backgroundImage: `url(${bgImage.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${config.primaryColor}33 25%, ${config.primaryColor}80 40%, ${config.primaryColor}CC 60%, ${config.primaryColor} 100%)`,
          }}
        ></div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
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
            Guatemala
          </h1>

          <p
            className="text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ color: config.neutralColor, opacity: 0.9 }}
          >
            Descubre la riqueza cultural y espiritual de las procesiones cuaresmales más
            impresionantes de América Latina. Una tradición que une fe, arte y devoción.
          </p>

          <p
            className="text-xs uppercase tracking-widest mb-6"
            style={{ color: config.thirdColor, opacity: 0.8 }}
          >
            Explorar
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <button
              className="px-8 py-4 rounded-sm font-medium text-base uppercase tracking-wide transition-all duration-300 hover:opacity-90 w-full md:w-auto"
              style={{
                backgroundColor: config.thirdColor,
                color: config.secondaryColor,
              }}
            >
              Ver Recorridos
            </button>
            <button
              className="px-8 py-4 rounded-sm font-medium text-base uppercase tracking-wide transition-all duration-300 hover:opacity-90 w-full md:w-auto"
              style={{
                backgroundColor: "transparent",
                color: config.thirdColor,
                border: `2px solid ${config.thirdColor}`,
              }}
            >
              Conocer Tradiciones
            </button>
          </div>
        </div>
      </section>

      <section className="px-3 sm:px-4 md:px-6 lg:px-8 py-20">
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
            Tradiciones de <span style={{ color: config.thirdColor }}>Cuaresma</span>
          </h2>
          <p className="text-lg" style={{ color: `${config.neutralColor}B3` }}>
            Las procesiones guatemaltecas son reconocidas mundialmente por su
            solemnidad, arte y profunda expresión de fe católica.
          </p>
        </div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tradiciones.map((item) => (
            <article
              key={item.id}
              // 1. Agregamos los eventos para detectar el mouse
              onMouseEnter={() => setTarjetaHover(item.id)}
              onMouseLeave={() => setTarjetaHover(null)}
              // 2. Agregamos 'transition-all duration-300' para que el cambio de color sea suave, y 'cursor-pointer'
              className={`rounded-2xl p-8 border h-full ${alturaTarjetas} transition-all duration-300 cursor-pointer`}
              style={{
                // 3. Magia aquí: Si el mouse está encima, borde de color thirdColor. Si no, borde normal.
                borderColor: tarjetaHover === item.id ? config.thirdColor : `${config.neutralColor}14`,
                
                // 4. Resplandor (Glow): Creamos una sombra con tu thirdColor (le agrego '4D' al final para que tenga un poco de transparencia y no brille en exceso)
                boxShadow: tarjetaHover === item.id ? `0 0 25px ${config.thirdColor}4D` : 'none',
                
                // 5. Opcional pero recomendado: que la tarjeta se "levante" un poquito
                transform: tarjetaHover === item.id ? 'translateY(-8px)' : 'translateY(0)',
                
                // Tu fondo original se mantiene igual
                background: `linear-gradient(135deg, ${config.neutralColor}08 0%, ${config.neutralColor}05 100%)`,
              }}
            >
          
              <div className="flex items-center gap-4 mb-6">
                
                {/* Ícono */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${config.thirdColor}1F` }}
                >
                  <item.Icono className="w-7 h-7" style={{ color: config.thirdColor }} />
                </div>
                
                {/* Título */}
                <h3
                  className="text-2xl font-serif font-semibold"
                  style={{ color: config.neutralColor }}
                >
                  {item.titulo}
                </h3>

              </div>
              
              {/* Descripción */}
              <p className="text-xl leading-relaxed" style={{ color: `${config.neutralColor}B3` }}>
                {item.descripcion}
              </p>
              
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
