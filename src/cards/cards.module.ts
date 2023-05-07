import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ListsModule } from 'src/lists/lists.module';
import { CardsResolver } from './cards.resolver';
import { CardsService } from './cards.service';
import { Card } from './entities/card.entity';

@Module({
  providers: [CardsResolver, CardsService],
  imports: [TypeOrmModule.forFeature([Card]), ListsModule],
  exports: [TypeOrmModule, CardsService],
})
export class CardsModule {}
