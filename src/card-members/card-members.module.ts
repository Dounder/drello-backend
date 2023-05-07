import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CardMembersResolver } from './card-members.resolver';
import { CardMembersService } from './card-members.service';
import { CardMember } from './entities/card-member.entity';

@Module({
  providers: [CardMembersResolver, CardMembersService],
  imports: [TypeOrmModule.forFeature([CardMember])],
  exports: [TypeOrmModule, CardMembersService],
})
export class CardMembersModule {}
