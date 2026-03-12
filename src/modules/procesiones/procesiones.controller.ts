import { NextResponse } from 'next/server';
import { ProcesionesService } from './procesiones.service';

export class ProcesionesController {
	private service = new ProcesionesService();

	async get() {
		try {
			const procesiones = await this.service.getProcesionesDisponibles();
			return NextResponse.json(procesiones, { status: 200 });
		} catch (error) {
			console.error('Error fetching procesiones:', error);
			return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
		}
	}

	async getById(idProcesion: number) {
		if (!Number.isInteger(idProcesion) || idProcesion <= 0) {
			return NextResponse.json({ error: 'El id de la procesion no es valido' }, { status: 400 });
		}

		try {
			const procesion = await this.service.getProcesionById(idProcesion);

			if (!procesion) {
				return NextResponse.json({ error: 'Procesion no encontrada' }, { status: 404 });
			}

			return NextResponse.json(procesion, { status: 200 });
		} catch (error) {
			console.error('Error fetching procesion by id:', error);
			return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
		}
	}
}
