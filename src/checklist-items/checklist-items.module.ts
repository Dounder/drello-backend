import { Module } from '@nestjs/common';
import { ChecklistItemsService } from './checklist-items.service';
import { ChecklistItemsResolver } from './checklist-items.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChecklistItem } from './entities/checklist-item.entity';

@Module({
  providers: [ChecklistItemsResolver, ChecklistItemsService],
  imports: [TypeOrmModule.forFeature([ChecklistItem])],
  exports: [TypeOrmModule, ChecklistItemsService],
})
export class ChecklistItemsModule {}
