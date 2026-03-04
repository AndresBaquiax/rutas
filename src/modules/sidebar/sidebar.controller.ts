import { NextResponse } from 'next/server';
import { SidebarService } from './sidebar.service';

export class SidebarController {
  private service = new SidebarService();

  async get() {
    try {
      const sidebar = await this.service.getAllSidebar();
      return NextResponse.json(sidebar, { status: 200 });
    } catch (error) {
      console.error('Error fetching sidebar:', error);
      return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
  }
}
