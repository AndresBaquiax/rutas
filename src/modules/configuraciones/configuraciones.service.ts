import { ConfiguracionesRepository } from './configuraciones.repository';

export class ConfiguracionesService {
  private repository = new ConfiguracionesRepository();

  async getAllConfiguraciones() {
    return await this.repository.findAll();
  }
}
