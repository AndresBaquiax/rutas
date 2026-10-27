import ProcesionDetailView from "@/components/ProcesionDetailView";
import dataRecorrido from "@/data/procesiones/sabadoSanto/dataRecorridoVirgenSoledadCalvario.json";

export default function InformacionPage() {
  return (
    <ProcesionDetailView
      dataRecorrido={dataRecorrido}
      imagenFondo="/carruselFotos/6.webp"
      lema="Madre de la Soledad"
    />
  );
}
