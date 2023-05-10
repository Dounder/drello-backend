import { Module } from '@nestjs/common';
import { ChecklistsService } from './checklists.service';
import { ChecklistsResolver } from './checklists.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Checklist } from './entities/checklist.entity';

@Module({
  providers: [ChecklistsResolver, ChecklistsService],
  imports: [TypeOrmModule.forFeature([Checklist])],
  exports: [TypeOrmModule, ChecklistsService],
})
export class ChecklistsModule {}
