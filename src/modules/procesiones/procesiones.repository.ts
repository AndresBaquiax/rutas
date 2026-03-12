import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { ProcesionDetalleDto, ProcesionListadoDto } from './procesiones.dto';

type ProcesionConRelaciones = Prisma.ProcesionGetPayload<{
	include: {
		iglesia: {
			include: {
				municipio: {
					include: {
						departamento: true;
					};
				};
			};
		};
		hermandad: true;
	};
}>;

function combineFechaYHora(fechaProcesion: Date, hora: Date): Date {
	const fechaHora = new Date(fechaProcesion);
	fechaHora.setHours(hora.getHours(), hora.getMinutes(), hora.getSeconds(), hora.getMilliseconds());
	return fechaHora;
}

function mapProcesion(procesion: ProcesionConRelaciones): ProcesionDetalleDto {
	return {
		idProcesion: procesion.idProcesion,
		idIglesia: {
			idIglesia: procesion.iglesia.idIglesia,
			nombreIglesia: procesion.iglesia.nombreIglesia,
			historiaIglesia: procesion.iglesia.historiaIglesia,
			municipio: {
				idMunicipio: procesion.iglesia.municipio.idMunicipio,
				nombreMunicipio: procesion.iglesia.municipio.nombreMunicipio,
				departamento: {
					idDepartamento: procesion.iglesia.municipio.departamento.idDepartamento,
					nombreDepartamento: procesion.iglesia.municipio.departamento.nombreDepartamento,
				},
			},
		},
		idHermandad: procesion.hermandad
			? {
					idHermandad: procesion.hermandad.idHermandad,
					nombreHermandad: procesion.hermandad.nombreHermandad,
					historiaHermandad: procesion.hermandad.historiaHermandad,
					historiaProcesion: procesion.hermandad.historiaProcesion,
				}
			: null,
		nombreProcesion: procesion.nombreProcesion,
		fechaProcesion: procesion.fechaProcesion,
		horaSalida: procesion.horaSalida,
		horaEntrada: procesion.horaEntrada,
		cantidadCargadores: procesion.cantidadCargadores,
		descripcionProcesion: procesion.descripcionProcesion,
		slugProcesion: procesion.slugProcesion,
	};
}

export class ProcesionesRepository {
	async findAllDisponibles(): Promise<ProcesionListadoDto[]> {
		const ahora = new Date();

		const procesiones = await prisma.procesion.findMany({
			where: {
				fechaProcesion: {
					not: null,
				},
			},
			include: {
				iglesia: {
					include: {
						municipio: {
							include: {
								departamento: true,
							},
						},
					},
				},
				hermandad: true,
			},
			orderBy: {
				fechaProcesion: 'asc',
			},
		});

		return procesiones
			.filter((procesion) => {
				if (!procesion.fechaProcesion || !procesion.horaEntrada) {
					return true;
				}

				const fechaHoraEntrada = combineFechaYHora(procesion.fechaProcesion, procesion.horaEntrada);
				const limiteVisible = new Date(fechaHoraEntrada);
				limiteVisible.setHours(limiteVisible.getHours() + 5);

				return ahora <= limiteVisible;
			})
			.map((procesion) => mapProcesion(procesion));
	}

	async findById(idProcesion: number): Promise<ProcesionDetalleDto | null> {
		const procesion = await prisma.procesion.findUnique({
			where: { idProcesion },
			include: {
				iglesia: {
					include: {
						municipio: {
							include: {
								departamento: true,
							},
						},
					},
				},
				hermandad: true,
			},
		});

		if (!procesion) {
			return null;
		}

		return mapProcesion(procesion);
	}
}
