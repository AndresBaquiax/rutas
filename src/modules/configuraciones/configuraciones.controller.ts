import { NextResponse } from 'next/server';
import { ConfiguracionesService } from './configuraciones.service';

export class ConfiguracionesController {
  private service = new ConfiguracionesService();

  async get() {
    try {
      const configuraciones = await this.service.getAllConfiguraciones();
      return NextResponse.json(configuraciones, { status: 200 });
    } catch (error) {
      console.error('Error fetching configuraciones:', error);
      return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
  }
}
