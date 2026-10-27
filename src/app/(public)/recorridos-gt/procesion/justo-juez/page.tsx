import ProcesionDetailView from "@/components/ProcesionDetailView";
import dataRecorrido from "@/data/procesiones/viernesSanto/dataRecorridoJustoJuez.json";

export default function InformacionPage() {
  return (
    <ProcesionDetailView
      dataRecorrido={dataRecorrido}
      imagenFondo="/images/fotoCatedral.webp"
      lema="Caminando junto a ti"
    />
  );
}
