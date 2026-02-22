type AjusteTiempoState = {
  offsetMinutos: number;
  actualizadoEn: string;
};

const estadoPorProcesion = new Map<string, AjusteTiempoState>();

const obtenerClave = (procesionId?: string) => {
  const valor = (procesionId ?? "default").trim();
  return valor.length > 0 ? valor : "default";
};

export const obtenerAjusteTiempo = (procesionId?: string) => {
  const clave = obtenerClave(procesionId);
  const estado = estadoPorProcesion.get(clave);

  if (!estado) {
    return {
      procesionId: clave,
      offsetMinutos: 0,
      actualizadoEn: null as string | null,
    };
  }

  return {
    procesionId: clave,
    offsetMinutos: estado.offsetMinutos,
    actualizadoEn: estado.actualizadoEn,
  };
};

export const aplicarAjusteTiempo = (tiempo: string, procesionId?: string) => {
  const clave = obtenerClave(procesionId);

  if (!/^[+-]\d+$/.test(tiempo)) {
    return null;
  }

  const deltaMinutos = Number(tiempo);

  if (!Number.isFinite(deltaMinutos)) {
    return null;
  }

  const estadoActual = estadoPorProcesion.get(clave);
  const offsetAnterior = estadoActual?.offsetMinutos ?? 0;
  const offsetActualizado = offsetAnterior + deltaMinutos;

  const siguienteEstado: AjusteTiempoState = {
    offsetMinutos: offsetActualizado,
    actualizadoEn: new Date().toISOString(),
  };

  estadoPorProcesion.set(clave, siguienteEstado);

  return {
    procesionId: clave,
    deltaMinutos,
    offsetMinutos: siguienteEstado.offsetMinutos,
    actualizadoEn: siguienteEstado.actualizadoEn,
  };
};
