export const formatearHora12 = (hora: string) => {
  const coincidencia = hora.match(/^(\d{2}):(\d{2})$/);

  if (!coincidencia) {
    return hora;
  }

  const horas24 = Number(coincidencia[1]);
  const minutos = coincidencia[2];
  const esPm = horas24 >= 12;
  const horas12 = horas24 % 12 === 0 ? 12 : horas24 % 12;
  const sufijo = esPm ? "p. m." : "a. m.";

  return `${String(horas12).padStart(2, "0")}:${minutos} ${sufijo}`;
};