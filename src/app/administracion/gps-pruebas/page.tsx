import type { Metadata } from "next";
import GpsPruebasPanel from "@/components/GpsPruebasPanel";

export const metadata: Metadata = {
  title: "Pruebas GPS · Traccar Client | Recorridos procesionales GT",
  description: "Panel de pruebas de conexión entre Traccar Client y el sistema de recorridos procesionales.",
  robots: { index: false, follow: false },
};

export default function GpsPruebasPage() {
  return <GpsPruebasPanel />;
}
