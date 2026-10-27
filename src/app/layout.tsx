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

export const metadata: Metadata = {
  title: "Recorridos Procesionales GT | Semana Santa y Velaciones",
  description:
    "Patrimonio, fe y tradición de los recorridos procesionales cuaresmales y velaciones en Quetzaltenango, Guatemala.",
  icons: {
    icon: "/logoRutas.png",
    shortcut: "/logoRutas.png",
    apple: "/logoRutas.png",
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
