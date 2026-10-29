import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import config from "@/data/procesiones/config.json";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Fonts
const sansFont = Plus_Jakarta_Sans({
  variable: "--font-sans-custom",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const serifFont = Cormorant_Garamond({
  variable: "--font-serif-custom",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

function resolveSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL;
  if (!raw) return "http://localhost:3000";
  return raw.startsWith("http://") || raw.startsWith("https://")
    ? raw
    : `https://${raw}`;
}

export const metadata: Metadata = {
  metadataBase: new URL(resolveSiteUrl()),
  title: {
    default: "Recorridos Procesionales Xela | Semana Santa y Velaciones",
    template: "%s | Recorridos Procesionales Xela",
  },
  description:
    "Consulta mapas de recorridos en vivo, horarios de paso, calendario oficial e historia de los cortejos procesionales y velaciones en Quetzaltenango (Xela), Guatemala.",
  openGraph: {
    title: "Recorridos Procesionales Xela | Semana Santa y Velaciones",
    description:
      "Consulta mapas de rutas en vivo, horarios de paso, calendario oficial e historia de cada cortejo en Quetzaltenango.",
    url: "/",
    siteName: "Recorridos Procesionales Xela",
    locale: "es_GT",
    type: "website",
    images: [
      {
        url: "/og-recorridos-xela.jpg",
        width: 1200,
        height: 630,
        alt: "Recorridos Procesionales en Quetzaltenango (Xela) — Mapas en vivo, calendario y cortejos",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Recorridos Procesionales Xela | Semana Santa y Velaciones",
    description:
      "Consulta mapas de rutas en vivo, horarios de paso, calendario oficial e historia de cada cortejo en Quetzaltenango.",
    images: ["/og-recorridos-xela.jpg"],
  },
  icons: {
    icon: [
      { url: "/images/logoRutas.svg", type: "image/svg+xml" },
      { url: "/logoRutas.png", type: "image/png" },
    ],
    shortcut: "/logoRutas.png",
    apple: "/redes/facebook-perfil.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeVars = {
    "--cfg-primary": config.primaryColor,
    "--cfg-secondary": config.secondaryColor,
    "--cfg-third": config.thirdColor,
    "--cfg-neutral": config.neutralColor,
    "--cfg-extra": config.extraColor,
    "--cfg-header": config.headerColor,
    "--cfg-card": config.cardColor,
    "--cfg-footer": config.footerColor,
    "--cfg-ida": config.idaColor,
    "--cfg-vuelta": config.vueltaColor,
    "--cfg-extra2": config.extraColor2,
    "--cfg-pin": config.colorPin,
    "--scroll-thumb-color": config.thirdColor,
    backgroundColor: config.primaryColor,
    color: config.neutralColor,
  } as React.CSSProperties;

  return (
    <html lang="es" className={`${sansFont.variable} ${serifFont.variable}`}>
      <body
        className="font-sans antialiased selection:bg-[var(--cfg-third)] selection:text-[var(--cfg-primary)]"
        style={themeVars}
      >
        <main className="min-h-screen">{children}</main>
        <SpeedInsights />
      </body>
    </html>
  );
}
