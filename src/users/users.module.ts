import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CardMembersModule } from 'src/card-members/card-members.module';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { BoardMembersModule } from 'src/board-members/board-members.module';

@Module({
  providers: [UsersResolver, UsersService],
  imports: [TypeOrmModule.forFeature([User]), PassportModule, CardMembersModule, BoardMembersModule],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
