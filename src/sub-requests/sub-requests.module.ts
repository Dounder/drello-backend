import { RequestsModule } from './../requests/requests.module';
import { SubRequest } from './entities/sub-request.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SubRequestsService } from './sub-requests.service';
import { SubRequestsResolver } from './sub-requests.resolver';

@Module({
  providers: [SubRequestsResolver, SubRequestsService],
  imports: [TypeOrmModule.forFeature([SubRequest]), RequestsModule],
  exports: [TypeOrmModule, SubRequestsService],
})
export class SubRequestsModule {}
