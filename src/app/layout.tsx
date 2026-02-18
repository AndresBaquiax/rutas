import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import sidebarItems from "@/data/sidebar.json";
import "./globals.css";

// Fonts
const primaryFont = Geist({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rutas",
  description: "App de rutas",
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
  return (
    <html lang="es">
      <body className={`${primaryFont.variable}`}>
        <Sidebar items={sidebarItems} />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
