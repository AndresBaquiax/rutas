import ProcesionDetailView from "@/components/ProcesionDetailView";
import dataRecorrido from "@/data/procesiones/velaciones/Catedral/dataRecorridoVelacionJustoJuez.json";

export default function InformacionPage() {
  return (
    <ProcesionDetailView
      dataRecorrido={dataRecorrido}
      imagenFondo="/images/fotoCatedral.webp"
      lema="Caminando junto a ti"
    />
  );
}
