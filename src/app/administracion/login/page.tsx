"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import config from "@/data/procesiones/config.json";

type FormType = 'signin' | 'signup' | 'forgot';

export default function LoginPage() {
  const [imagenesCarrusel, setImagenesCarrusel] = useState<string[]>([]);
  const [indiceCarrusel, setIndiceCarrusel] = useState(0);
  const [formType, setFormType] = useState<FormType>('signin');

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
    if (imagenesCarrusel.length <= 1) return;
    const temporizadorCarrusel = setInterval(() => {
      setIndiceCarrusel((indiceAnterior) => (indiceAnterior + 1) % imagenesCarrusel.length);
    }, 5000);
    return () => clearInterval(temporizadorCarrusel);
  }, [imagenesCarrusel.length]);

  const imagenesHero = imagenesCarrusel.length > 0 ? imagenesCarrusel : ["/carruselFotos/1.webp"];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Lado Izquierdo: Formularios */}
      <div className="w-full lg:w-5/12 flex flex-col items-center justify-center p-8 sm:p-12 lg:p-16 relative">
        
        {/* Logo */}
        <div className="absolute top-8 sm:top-12 lg:top-12 left-0 right-0 flex flex-col items-center justify-center z-10">
          <Image src="/logoRutas.png" alt="Logo" width={250} height={100} className="h-24 w-auto object-contain mb-3" />
          <h1 className="text-2xl font-bold text-center font-serif" style={{ color: config.thirdColor }}>
            Recorridos <br /> Procesionales
          </h1>
        </div>

        <div className="w-full max-w-md flex flex-col justify-center w-full z-10 mt-20 mb-20">
          
          {/* Formulario Principal */}
          <div className="w-full">
            
            {/* SIGN IN */}
            {formType === 'signin' && (
              <div className="animate-fade-in-up">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Iniciar Sesión</h2>
                </div>
                
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Correo Electrónico</label>
                    <input 
                      type="email" 
                      className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-900 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-semibold text-gray-900">Contraseña</label>
                      <button 
                        type="button"
                        onClick={() => setFormType('forgot')}
                        className="text-sm font-semibold hover:underline"
                        style={{ color: config.primaryColor }}
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>
                    <input 
                      type="password" 
                      className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="pt-2">
                    <button 
                      type="submit" 
                      className="w-full py-4 px-8 rounded-xl font-bold text-white transition-all transform hover:scale-[1.02] shadow-lg"
                      style={{ backgroundColor: config.primaryColor }}
                    >
                      Ingresar
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* SIGN UP */}
            {formType === 'signup' && (
              <div className="animate-fade-in-up">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Registro</h2>
                  <p className="text-gray-500">Ingresa tus datos para crear una cuenta</p>
                </div>
                
                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                  <input 
                    type="text" placeholder="Nombre completo" 
                    className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 transition-all"
                  />
                  <input 
                    type="email" placeholder="Correo Electrónico" 
                    className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 transition-all"
                  />
                  <input 
                    type="password" placeholder="Contraseña" 
                    className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 transition-all"
                  />
                  <input 
                    type="password" placeholder="Confirmar Contraseña" 
                    className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 transition-all"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                    <span className="text-sm text-gray-600">
                      Acepto los <a href="#" className="font-semibold hover:underline" style={{ color: config.primaryColor }}>términos y condiciones</a>.
                    </span>
                  </div>
                  <div className="pt-4 flex gap-4">
                    <button 
                      type="submit" 
                      className="flex-1 py-4 px-6 rounded-xl font-bold text-white transition-all shadow-md hover:opacity-90"
                      style={{ backgroundColor: config.primaryColor }}
                    >
                      Registrarse
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setFormType('signin')}
                      className="flex-1 py-4 px-6 rounded-xl font-bold transition-all border-2"
                      style={{ borderColor: config.primaryColor, color: config.primaryColor }}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* FORGOT PASSWORD */}
            {formType === 'forgot' && (
              <div className="animate-fade-in-up">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">¿Olvidaste tu contraseña?</h2>
                  <p className="text-gray-500">Ingresa tu correo para restablecerla</p>
                </div>
                
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <input 
                    type="email" placeholder="Correo Electrónico" 
                    className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 transition-all"
                  />
                  <div className="pt-4 flex gap-4">
                    <button 
                      type="submit" 
                      className="flex-1 py-4 px-6 rounded-xl font-bold text-white transition-all shadow-md hover:opacity-90"
                      style={{ backgroundColor: config.primaryColor }}
                    >
                      Enviar
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setFormType('signin')}
                      className="flex-1 py-4 px-6 rounded-xl font-bold transition-all border-2"
                      style={{ borderColor: config.primaryColor, color: config.primaryColor }}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}
            
          </div>

        </div>
      </div>

      {/* Lado Derecho: Carrusel y Textos */}
      <div className="hidden lg:flex w-full lg:w-7/12 relative overflow-hidden flex-col justify-center" style={{ backgroundColor: config.secondaryColor }}>
        
        {/* Fondo del Carrusel */}
        <div className="absolute inset-0 z-0">
          {imagenesHero.map((imagen, indice) => (
            <div
              key={imagen}
              className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
              style={{
                backgroundImage: `url(${imagen})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                opacity: indice === indiceCarrusel % imagenesHero.length ? 1 : 0,
              }}
            />
          ))}
          
          {/* Overlay oscuro/gradiente para mejorar lectura de texto */}
          <div 
            className="absolute inset-0" 
            style={{ 
              background: `linear-gradient(180deg, transparent 0%, ${config.primaryColor}33 25%, ${config.primaryColor}80 40%, ${config.primaryColor}CC 60%, ${config.primaryColor} 100%)`,
              opacity: 0.8
            }} 
          />
        </div>

        {/* Textos sobre el carrusel */}
        <div className="relative z-10 text-center px-12 xl:px-24 w-full pt-40">
          <h3 
            className="text-4xl xl:text-6xl font-serif font-bold mb-6 drop-shadow-xl" 
            style={{ color: config.thirdColor }}
          >
            Procesiondes de Quetzaltenango
          </h3>
          <p 
            className="text-xl xl:text-2xl font-medium drop-shadow-md leading-relaxed" 
            style={{ color: config.neutralColor, opacity: 0.9 }}
          >
            Descubre la riqueza cultural y espiritual de las procesiones cuaresmales más 
            <br />
            impresionantes de América Latina. Una tradición que une fe, arte y devoción.
          </p>
        </div>
        
      </div>
    </div>
  );
}
