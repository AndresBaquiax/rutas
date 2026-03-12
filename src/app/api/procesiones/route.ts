import { ProcesionesController } from '@/modules/procesiones/procesiones.controller';

const controller = new ProcesionesController();

export async function GET() {
	return await controller.get();
}
