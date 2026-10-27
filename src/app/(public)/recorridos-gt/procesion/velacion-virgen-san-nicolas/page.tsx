import ProcesionDetailView from "@/components/ProcesionDetailView";
import dataRecorrido from "@/data/procesiones/velaciones/dataRecorridoVelacionVigenSanNicolas.json";

export default function InformacionPage() {
  return (
    <ProcesionDetailView
      dataRecorrido={dataRecorrido}
      imagenFondo="/carruselFotos/17.webp"
      lema="Madre Reina"
    />
  );
}
