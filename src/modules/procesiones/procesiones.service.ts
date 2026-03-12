import { ProcesionesRepository } from './procesiones.repository';

export class ProcesionesService {
	private repository = new ProcesionesRepository();

	async getProcesionesDisponibles() {
		return await this.repository.findAllDisponibles();
	}

	async getProcesionById(idProcesion: number) {
		return await this.repository.findById(idProcesion);
	}
}
