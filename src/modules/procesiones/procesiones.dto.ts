export interface ProcesionIglesiaDto {
  idIglesia: number;
  nombreIglesia: string;
  historiaIglesia: string | null;
  municipio: {
    idMunicipio: number;
    nombreMunicipio: string;
    departamento: {
      idDepartamento: number;
      nombreDepartamento: string;
    };
  };
}

export interface ProcesionHermandadDto {
  idHermandad: number;
  nombreHermandad: string;
  historiaHermandad: string | null;
  historiaProcesion: string | null;
}

export interface ProcesionDetalleDto {
  idProcesion: number;
  idIglesia: ProcesionIglesiaDto;
  idHermandad: ProcesionHermandadDto | null;
  nombreProcesion: string;
  fechaProcesion: Date | null;
  horaSalida: Date | null;
  horaEntrada: Date | null;
  cantidadCargadores: number | null;
  descripcionProcesion: string | null;
  slugProcesion: string;
}

export interface ProcesionListadoDto extends ProcesionDetalleDto {}
