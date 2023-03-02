import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListsModule } from './../lists/lists.module';
import { Request } from './entities/request.entity';
import { RequestsResolver } from './requests.resolver';
import { RequestsService } from './requests.service';

@Module({
  providers: [RequestsResolver, RequestsService],
  imports: [TypeOrmModule.forFeature([Request]), ListsModule],
  exports: [TypeOrmModule, RequestsService],
})
export class RequestsModule {}
