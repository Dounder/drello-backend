import { SeedController } from './seed.controller';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './../users/users.module';
import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [ConfigModule, UsersModule],
})
export class SeedModule {}
