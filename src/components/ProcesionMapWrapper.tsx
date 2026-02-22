"use client";

import dynamic from "next/dynamic";

type Coordenada = {
  latitud: number;
  longitud: number;
  regreso: boolean;
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
  procesionId?: string;
};

const ProcesionMap = dynamic(() => import("@/components/ProcesionMap"), {
  ssr: false,
});

export default function ProcesionMapWrapper(props: ProcesionMapWrapperProps) {
  return <ProcesionMap {...props} />;
}
