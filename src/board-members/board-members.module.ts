import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BoardMembersResolver } from './board-members.resolver';
import { BoardMembersService } from './board-members.service';
import { BoardMember } from './entities/board-member.entity';

@Module({
  providers: [BoardMembersResolver, BoardMembersService],
  imports: [TypeOrmModule.forFeature([BoardMember])],
  exports: [TypeOrmModule, BoardMembersService],
})
export class BoardMembersModule {}
