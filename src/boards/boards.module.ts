import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BoardMembersModule } from 'src/board-members/board-members.module';
import { BoardsResolver } from './boards.resolver';
import { BoardsService } from './boards.service';
import { Board } from './entities/board.entity';

@Module({
  providers: [BoardsResolver, BoardsService],
  imports: [TypeOrmModule.forFeature([Board]), BoardMembersModule],
  exports: [TypeOrmModule, BoardsService],
})
export class BoardsModule {}
