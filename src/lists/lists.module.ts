import { List } from './entities/list.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsResolver } from './lists.resolver';
import { BoardsModule } from 'src/boards/boards.module';

@Module({
  providers: [ListsResolver, ListsService],
  imports: [TypeOrmModule.forFeature([List]), BoardsModule],
  exports: [TypeOrmModule, ListsService],
})
export class ListsModule {}
