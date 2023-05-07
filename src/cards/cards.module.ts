import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CardsService } from './cards.service';
import { CardsResolver } from './cards.resolver';
import { Card } from './entities/card.entity';
import { ListsModule } from 'src/lists/lists.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [CardsResolver, CardsService],
  imports: [TypeOrmModule.forFeature([Card]), ListsModule, UsersModule],
  exports: [TypeOrmModule, CardsService],
})
export class CardsModule {}
