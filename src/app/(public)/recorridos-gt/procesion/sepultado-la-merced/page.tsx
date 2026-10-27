import ProcesionDetailView from "@/components/ProcesionDetailView";
import dataRecorrido from "@/data/procesiones/viernesSanto/dataRecorridoLaMerced.json";

export default function InformacionPage() {
  return (
    <ProcesionDetailView
      dataRecorrido={dataRecorrido}
      imagenFondo="/carruselFotos/3.webp"
      lema="Rey de la Paz"
    />
  );
}
