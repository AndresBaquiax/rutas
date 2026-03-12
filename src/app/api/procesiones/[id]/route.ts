import { ProcesionesController } from '@/modules/procesiones/procesiones.controller';

const controller = new ProcesionesController();

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_: Request, { params }: RouteParams) {
  const { id } = await params;
  return await controller.getById(Number(id));
}