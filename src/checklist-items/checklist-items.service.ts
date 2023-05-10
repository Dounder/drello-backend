import { Injectable } from '@nestjs/common';
import { CreateChecklistItemInput } from './dto/create-checklist-item.input';
import { UpdateChecklistItemInput } from './dto/update-checklist-item.input';

@Injectable()
export class ChecklistItemsService {
  create(createChecklistItemInput: CreateChecklistItemInput) {
    return 'This action adds a new checklistItem';
  }

  findAll() {
    return `This action returns all checklistItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} checklistItem`;
  }

  update(id: number, updateChecklistItemInput: UpdateChecklistItemInput) {
    return `This action updates a #${id} checklistItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} checklistItem`;
  }
}
