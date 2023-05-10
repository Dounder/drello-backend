import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CardsService } from 'src/cards/cards.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateChecklistInput } from './dto/create-checklist.input';
import { UpdateChecklistInput } from './dto/update-checklist.input';
import { Checklist } from './entities/checklist.entity';
import { PaginationArgs } from 'src/common/dto';

@Injectable()
export class ChecklistsService {
  constructor(
    @InjectRepository(Checklist)
    private checklistsRepository: Repository<Checklist>,
  ) {}

  async create(createChecklistInput: CreateChecklistInput, user: User): Promise<Checklist> {
    const checklist = this.checklistsRepository.create({
      ...createChecklistInput,
      card: { id: createChecklistInput.cardId },
      createdBy: user,
    });

    return this.checklistsRepository.save(checklist);
  }

  async findAll(pagination: PaginationArgs): Promise<Checklist[]> {
    const { limit, offset } = pagination;

    return this.checklistsRepository.find({
      skip: offset,
      take: limit,
    });
  }

  async findAllByCardId(cardId: string, pagination: PaginationArgs): Promise<Checklist[]> {
    const { limit, offset } = pagination;
    return this.checklistsRepository.find({
      where: { card: { id: cardId } },
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: string): Promise<Checklist> {
    const checklist = await this.checklistsRepository.findOneBy({ id });
    if (!checklist) throw new NotFoundException(`Checklist #${id} not found`);
    return checklist;
  }

  async update(id: string, updateChecklistInput: UpdateChecklistInput): Promise<Checklist> {
    const checklist = await this.findOne(id);

    return this.checklistsRepository.save({
      ...checklist,
      ...updateChecklistInput,
    });
  }

  async remove(id: string): Promise<Checklist> {
    const checklist = await this.findOne(id);
    await this.checklistsRepository.softRemove(checklist);
    return checklist;
  }
}
