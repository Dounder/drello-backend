import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ListsModule } from 'src/lists/lists.module';
import { CardsResolver } from './cards.resolver';
import { CardsService } from './cards.service';
import { Card } from './entities/card.entity';
import { CardMembersModule } from 'src/card-members/card-members.module';
import { ChecklistsModule } from 'src/checklists/checklists.module';

@Module({
  providers: [CardsResolver, CardsService],
  imports: [TypeOrmModule.forFeature([Card]), ListsModule, CardMembersModule, ChecklistsModule],
  exports: [TypeOrmModule, CardsService],
})
export class CardsModule {}
