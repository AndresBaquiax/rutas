"use client";

import dynamic from "next/dynamic";

type Coordenada = {
  latitud: number;
  longitud: number;
  regreso: boolean;
};

export type Cancion = {
  titulo: string;
  coordenada?:
    | { latitud: number; longitud: number }[]
    | { latitud: number; longitud: number };
};

type ProcesionMapWrapperProps = {
  coordenadas: Coordenada[];
  primaryColor: string;
  vueltaColor: string;
  idaColor: string;
  fecha: string;
  horaSalida: string;
  horaEntrada: string;
  pinColor?: string;
  puntoInteresSeleccionado?: { latitud: number; longitud: number } | null;
  centrarTrigger?: number;
  imagenUrl?: string;
  identificadorDispositivo?: string;
  canciones?: Cancion[];
  neutralColor?: string;
  thirdColor?: string;
  onCancionActivaChange?: (cancion: Cancion | null, indice: number | null) => void;
};

const ProcesionMap = dynamic(() => import("@/components/ProcesionMap"), {
  ssr: false,
});

export default function ProcesionMapWrapper(props: ProcesionMapWrapperProps) {
  return <ProcesionMap {...props} />;
}
