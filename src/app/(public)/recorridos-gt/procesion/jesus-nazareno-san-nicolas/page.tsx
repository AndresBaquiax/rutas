import ProcesionDetailView from "@/components/ProcesionDetailView";
import dataRecorrido from "@/data/procesiones/juevesSanto/dataRecorridoInfantilSanNicolas.json";

export default function InformacionPage() {
  return (
    <ProcesionDetailView
      dataRecorrido={dataRecorrido}
      imagenFondo="/carruselFotos/16.webp"
      lema="Rey de Reyes"
    />
  );
}
