import ProcesionDetailView from "@/components/ProcesionDetailView";
import dataRecorrido from "@/data/procesiones/domingoResureccion/dataRecorridoResucitadoSanNicolas.json";

export default function InformacionPage() {
  return (
    <ProcesionDetailView
      dataRecorrido={dataRecorrido}
      imagenFondo="/images/resucitado-san-nicolas.webp"
      lema="¡Aleluya! Ha resucitado"
    />
  );
}
