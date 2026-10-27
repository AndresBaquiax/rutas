import ProcesionDetailView from "@/components/ProcesionDetailView";
import dataRecorrido from "@/data/procesiones/velaciones/dataRecorridoVelacionSanJuanDeDios.json";

export default function InformacionPage() {
  return (
    <ProcesionDetailView
      dataRecorrido={dataRecorrido}
      imagenFondo="/carruselFotos/2.webp"
      lema="Madre y consuelo"
    />
  );
}
