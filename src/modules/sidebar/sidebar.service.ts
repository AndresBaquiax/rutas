import { SidebarRepository } from './sidebar.repository';

export class SidebarService {
  private repository = new SidebarRepository();

  async getAllSidebar() {
    return await this.repository.findAll();
  }
}
