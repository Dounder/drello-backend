import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectsResolver } from './projects.resolver';
import { ProjectsService } from './projects.service';

@Module({
  providers: [ProjectsResolver, ProjectsService],
  imports: [TypeOrmModule.forFeature([Project])],
  exports: [TypeOrmModule, ProjectsService],
})
export class ProjectsModule {}
