import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './../users/users.module';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { BoardsModule } from 'src/boards/boards.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [ConfigModule, UsersModule, BoardsModule],
})
export class SeedModule {}
