import { Injectable } from '@nestjs/common';
import { PrismamService } from '../prismam/prismam.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismamService) {}

  async editUser(userId: number) {}
}
