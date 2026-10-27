import ProcesionDetailView from "@/components/ProcesionDetailView";
import dataRecorrido from "@/data/procesiones/viernesSanto/dataRecorridoSepultadoTransfiguracion.json";

export default function InformacionPage() {
  return (
    <ProcesionDetailView
      dataRecorrido={dataRecorrido}
      imagenFondo="/carruselFotos/7.webp"
      lema="Rey de la Paz"
    />
  );
}
