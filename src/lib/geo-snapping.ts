/**
 * Módulo de ajuste geométrico (Snapping) a la ruta de la procesión.
 *
 * Proyecta ortogonalmente coordenadas GPS sobre la polilínea del recorrido cuando
 * el dispositivo se encuentra sobre la calle prevista (umbral configurable, por defecto 35m).
 *
 * Si el cortejo procesional se desvía de la ruta (por lluvia, emergencia o cambio de recorrido)
 * o si se está probando desde fuera del recorrido, muestra la ubicación real del GPS sin forzarla.
 */

export type CoordenadaRuta = {
  latitud: number;
  longitud: number;
  regreso?: boolean;
};

export type ResultadoAjuste = {
  /** Coordenada final: centrada en la calle si está en la ruta, o real si está fuera de ella */
  posicionAjustada: [number, number];
  /** Coordenada proyectada sobre el eje de la calle del recorrido */
  posicionSobreCalle: [number, number];
  /** Distancia en metros desde la coordenada GPS cruda hasta la calle del recorrido */
  distanciaGpsMetros: number;
  /** true si el GPS está a menos o igual al umbral de la calle (<= umbralMaximoMetros) */
  dentroDelRecorrido: boolean;
  /** Índice del segmento más cercano (0 .. n-2) */
  indiceSegmento: number;
  /** Factor t dentro del segmento (0 a 1) */
  factorSegmento: number;
};

/**
 * Calcula la distancia aproximada en metros entre dos coordenadas (lat, lon).
 */
export function calcularDistanciaMetros(
  p1: [number, number],
  p2: [number, number],
): number {
  const degToRad = Math.PI / 180;
  const latMidRad = ((p1[0] + p2[0]) / 2) * degToRad;
  const dx = (p2[1] - p1[1]) * Math.cos(latMidRad) * 111320;
  const dy = (p2[0] - p1[0]) * 110574;
  return Math.round(Math.sqrt(dx * dx + dy * dy) * 10) / 10;
}

/**
 * Evalúa la posición GPS respecto a la ruta planificada:
 * - Si está en el recorrido (distancia <= umbralMaximoMetros): centra la posición sobre la calle.
 * - Si se sale del recorrido (desvío, emergencia, prueba remota > umbralMaximoMetros): conserva la posición GPS real.
 */
export function ajustarCoordenadaARuta(
  puntoGps: [number, number],
  coordenadasRuta: CoordenadaRuta[],
  umbralMaximoMetros: number = 35,
): ResultadoAjuste | null {
  if (!coordenadasRuta || coordenadasRuta.length === 0) {
    return null;
  }

  if (coordenadasRuta.length === 1) {
    const unica = coordenadasRuta[0];
    const dist = calcularDistanciaMetros(puntoGps, [unica.latitud, unica.longitud]);
    const dentro = dist <= umbralMaximoMetros;
    return {
      posicionAjustada: dentro ? [unica.latitud, unica.longitud] : puntoGps,
      posicionSobreCalle: [unica.latitud, unica.longitud],
      distanciaGpsMetros: dist,
      dentroDelRecorrido: dentro,
      indiceSegmento: 0,
      factorSegmento: 0,
    };
  }

  const [latGps, lonGps] = puntoGps;
  const degToRad = Math.PI / 180;
  const latMidRad = latGps * degToRad;
  const factorLon = Math.cos(latMidRad) * 111320;
  const factorLat = 110574;

  let menorDistancia = Infinity;
  let mejorPunto: [number, number] = [coordenadasRuta[0].latitud, coordenadasRuta[0].longitud];
  let mejorIndice = 0;
  let mejorT = 0;

  for (let i = 0; i < coordenadasRuta.length - 1; i++) {
    const A = coordenadasRuta[i];
    const B = coordenadasRuta[i + 1];

    const dx = (B.longitud - A.longitud) * factorLon;
    const dy = (B.latitud - A.latitud) * factorLat;
    const lenSq = dx * dx + dy * dy;

    let t = 0;
    if (lenSq > 0) {
      const px = (lonGps - A.longitud) * factorLon;
      const py = (latGps - A.latitud) * factorLat;
      t = (px * dx + py * dy) / lenSq;
      t = Math.max(0, Math.min(1, t));
    }

    const projLat = A.latitud + t * (B.latitud - A.latitud);
    const projLon = A.longitud + t * (B.longitud - A.longitud);

    const distLat = (latGps - projLat) * factorLat;
    const distLon = (lonGps - projLon) * factorLon;
    const dist = Math.sqrt(distLat * distLat + distLon * distLon);

    if (dist < menorDistancia) {
      menorDistancia = dist;
      mejorPunto = [projLat, projLon];
      mejorIndice = i;
      mejorT = t;
    }
  }

  const distRedondeada = Math.round(menorDistancia * 10) / 10;
  const dentro = distRedondeada <= umbralMaximoMetros;

  return {
    // Si está en el recorrido (<= 35m) se centra; si se sale del recorrido (> 35m) se muestra GPS real:
    posicionAjustada: dentro ? mejorPunto : puntoGps,
    posicionSobreCalle: mejorPunto,
    distanciaGpsMetros: distRedondeada,
    dentroDelRecorrido: dentro,
    indiceSegmento: mejorIndice,
    factorSegmento: mejorT,
  };
}
