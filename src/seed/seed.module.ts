import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from './../clients/clients.module';
import { ProjectsModule } from './../projects/projects.module';
import { UsersModule } from './../users/users.module';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [ConfigModule, UsersModule, ClientsModule, ProjectsModule],
})
export class SeedModule {}
