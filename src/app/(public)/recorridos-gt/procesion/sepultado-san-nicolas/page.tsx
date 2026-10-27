import ProcesionDetailView from "@/components/ProcesionDetailView";
import dataRecorrido from "@/data/procesiones/viernesSanto/dataRecorridoSepultadoSanNicolas.json";

export default function InformacionPage() {
  return (
    <ProcesionDetailView
      dataRecorrido={dataRecorrido}
      imagenFondo="/carruselFotos/12.webp"
      lema="Rey de la Paz"
    />
  );
}
