import ProcesionDetailView from "@/components/ProcesionDetailView";
import dataRecorrido from "@/data/procesiones/viernesSanto/dataRecorridoJesusNazareno.json";

export default function InformacionPage() {
  return (
    <ProcesionDetailView
      dataRecorrido={dataRecorrido}
      imagenFondo="/carruselFotos/1.webp"
      lema="Protector de Quetzaltenango"
    />
  );
}
