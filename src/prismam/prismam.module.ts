import { Global, Module } from '@nestjs/common';
import { PrismamService } from './prismam.service';

@Global()
@Module({
  providers: [PrismamService],
  exports: [PrismamService],
})
export class PrismamModule {}
