import { readdir } from "fs/promises";
import path from "path";

const EXTENSIONES_VALIDAS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

export async function GET() {
  try {
    const carpetaCarrusel = path.join(process.cwd(), "public", "carruselFotos");
    const archivos = await readdir(carpetaCarrusel);

    const imagenes = archivos
      .filter((nombreArchivo) => {
        const extension = path.extname(nombreArchivo).toLowerCase();
        return EXTENSIONES_VALIDAS.includes(extension);
      })
      .sort((a, b) => a.localeCompare(b, "es", { numeric: true }))
      .map((nombreArchivo) => `/carruselFotos/${nombreArchivo}`);

    return Response.json(imagenes);
  } catch {
    return Response.json([]);
  }
}
