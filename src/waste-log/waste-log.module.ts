import { Module } from '@nestjs/common';
import { WasteLogService } from './waste-log.service';
import { WasteLogController } from './waste-log.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WasteLogController],
  providers: [WasteLogService],
  exports: [WasteLogService],
})
export class WasteLogModule {}
