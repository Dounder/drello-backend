import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChecklistItemsModule } from 'src/checklist-items/checklist-items.module';
import { ChecklistsResolver } from './checklists.resolver';
import { ChecklistsService } from './checklists.service';
import { Checklist } from './entities/checklist.entity';

@Module({
  providers: [ChecklistsResolver, ChecklistsService],
  imports: [TypeOrmModule.forFeature([Checklist]), ChecklistItemsModule],
  exports: [TypeOrmModule, ChecklistsService],
})
export class ChecklistsModule {}
