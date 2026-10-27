import ProcesionDetailView from "@/components/ProcesionDetailView";
import dataRecorrido from "@/data/procesiones/velaciones/San-Nicolas/dataRecorridoVelacionSepultadoSanNicolas.json";

export default function InformacionPage() {
  return (
    <ProcesionDetailView
      dataRecorrido={dataRecorrido}
      imagenFondo="/carruselFotos/18.webp"
      lema="Unidos en una sola fe"
    />
  );
}
