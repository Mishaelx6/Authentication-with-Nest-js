import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { WasteLogModule } from './waste-log/waste-log.module';

@Module({
  imports: [PrismaModule, AuthModule, WasteLogModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
