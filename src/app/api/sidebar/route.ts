import { SidebarController } from '@/modules/sidebar/sidebar.controller';

const controller = new SidebarController();

export async function GET() {
  return await controller.get();
}
