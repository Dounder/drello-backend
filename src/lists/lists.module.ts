import { ProjectsModule } from './../projects/projects.module';
import { List } from './entities/list.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsResolver } from './lists.resolver';

@Module({
  providers: [ListsResolver, ListsService],
  imports: [TypeOrmModule.forFeature([List]), ProjectsModule],
  exports: [TypeOrmModule, ListsService],
})
export class ListsModule {}
