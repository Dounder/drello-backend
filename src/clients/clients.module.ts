import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsResolver } from './clients.resolver';
import { ClientsService } from './clients.service';
import { Client } from './entities/client.entity';

@Module({
  providers: [ClientsResolver, ClientsService],
  imports: [TypeOrmModule.forFeature([Client])],
  exports: [TypeOrmModule, ClientsService],
})
export class ClientsModule {}
