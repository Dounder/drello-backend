import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationArgs } from 'src/common/dto';
import { CreateChecklistItemInput } from './dto/create-checklist-item.input';
import { UpdateChecklistItemInput } from './dto/update-checklist-item.input';
import { ChecklistItem } from './entities/checklist-item.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ChecklistItemsService {
  constructor(
    @InjectRepository(ChecklistItem)
    private readonly checklistItemsRepository: Repository<ChecklistItem>,
  ) {}

  async create(createChecklistItemInput: CreateChecklistItemInput, user: User): Promise<ChecklistItem> {
    const checklistItem = this.checklistItemsRepository.create({
      ...createChecklistItemInput,
      checklist: { id: createChecklistItemInput.checklistId },
      createdBy: user,
    });
    return this.checklistItemsRepository.save(checklistItem);
  }

  async findAll(pagination: PaginationArgs): Promise<ChecklistItem[]> {
    const { limit, offset } = pagination;

    return this.checklistItemsRepository.find({
      skip: offset,
      take: limit,
    });
  }

  async findAllByChecklistId(checklistId: string, pagination: PaginationArgs): Promise<ChecklistItem[]> {
    const { limit, offset } = pagination;

    return this.checklistItemsRepository.find({
      where: { checklist: { id: checklistId } },
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: string): Promise<ChecklistItem> {
    const item = await this.checklistItemsRepository.findOneBy({ id });
    if (!item) throw new NotFoundException(`ChecklistItem #${id} not found`);
    return item;
  }

  async update(id: string, updateChecklistItemInput: UpdateChecklistItemInput): Promise<ChecklistItem> {
    const item = await this.findOne(id);

    return this.checklistItemsRepository.save({
      ...item,
      ...updateChecklistItemInput,
    });
  }

  async remove(id: string): Promise<ChecklistItem> {
    const item = await this.findOne(id);

    await this.checklistItemsRepository.remove(item);

    return { ...item, id };
  }
}
