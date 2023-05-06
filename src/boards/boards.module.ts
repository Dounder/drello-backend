import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsResolver } from './boards.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';

@Module({
  providers: [BoardsResolver, BoardsService],
  imports: [TypeOrmModule.forFeature([Board])],
  exports: [TypeOrmModule, BoardsService],
})
export class BoardsModule {}
