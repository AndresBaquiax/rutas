import bgImage from "@/assets/main/1.jpg";
import config from "@/data/config.json";

export default function Home() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: `url(${bgImage.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay oscuro con degradado de arriba (transparente) a abajo (oscuro) */}
      <div 
        className="absolute inset-0" 
        style={{ 
          background: `linear-gradient(180deg, transparent 0%, ${config.primaryColor}33 25%, ${config.primaryColor}80 40%, ${config.primaryColor}CC 60%, ${config.primaryColor} 100%)`
        }}
      ></div>

      {/* Contenido */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        {/* Subtítulo superior */}
        <p 
          className="text-sm uppercase tracking-widest mb-4 font-medium px-6 py-3 rounded-full inline-block"
          style={{ 
            color: config.thirdColor,
            background: `linear-gradient(90deg, ${config.primaryColor}00 0%, ${config.primaryColor}E6 50%, ${config.primaryColor}00 100%)`
          }}
        >
          Tradición y Fe
        </p>

        {/* Título principal */}
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

        {/* Descripción */}
        <p 
          className="text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed"
          style={{ color: config.neutralColor, opacity: 0.9 }}
        >
          Descubre la riqueza cultural y espiritual de las procesiones cuaresmales más 
          impresionantes de América Latina. Una tradición que une fe, arte y devoción.
        </p>

        {/* Texto "EXPLORAR" */}
        <p 
          className="text-xs uppercase tracking-widest mb-6"
          style={{ color: config.thirdColor, opacity: 0.8 }}
        >
          Explorar
        </p>

        {/* Botones */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <button
            className="px-8 py-4 rounded-sm font-medium text-base uppercase tracking-wide transition-all duration-300 hover:opacity-90 w-full md:w-auto"
            style={{ 
              backgroundColor: config.thirdColor,
              color: config.secondaryColor
            }}
          >
            Ver Recorridos
          </button>
          <button
            className="px-8 py-4 rounded-sm font-medium text-base uppercase tracking-wide transition-all duration-300 hover:opacity-90 w-full md:w-auto"
            style={{ 
              backgroundColor: 'transparent',
              color: config.thirdColor,
              border: `2px solid ${config.thirdColor}`
            }}
          >
            Conocer Tradiciones
          </button>
        </div>
      </div>
    </div>
  );
}
