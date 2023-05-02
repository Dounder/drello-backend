import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProjectsModule } from './../projects/projects.module';
import { UsersModule } from './../users/users.module';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [ConfigModule, UsersModule, ProjectsModule],
})
export class SeedModule {}
