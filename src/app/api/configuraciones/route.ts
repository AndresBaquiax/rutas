import { ConfiguracionesController } from '@/modules/configuraciones/configuraciones.controller';

const controller = new ConfiguracionesController();

export async function GET() {
  return await controller.get();
}
