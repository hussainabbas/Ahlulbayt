import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminGuidesService {
  list() {
    return { items: [], total: 0, status: 'stub' };
  }

  getById(id: string) {
    return { id, status: 'stub' };
  }
}
