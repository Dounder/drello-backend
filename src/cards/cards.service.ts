import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationArgs, SearchArgs } from 'src/common/dto';
import { HandleExceptions } from 'src/common/helpers/handle-exceptions.helper';
import { ListsService } from 'src/lists/lists.service';
import { User } from 'src/users/entities/user.entity';
import { CreateCardInput } from './dto/create-card.input';
import { UpdateCardInput } from './dto/update-card.input';
import { Card } from './entities/card.entity';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    private readonly listService: ListsService,
  ) {}

  async create(createCardInput: CreateCardInput, user: User): Promise<Card> {
    const list = await this.listService.findOne(createCardInput.listId);
    const card = this.cardRepository.create({
      ...createCardInput,
      list,
      createdBy: user,
    });
    return await this.cardRepository.save(card);
  }

  async findAll(paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<Card[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const query = this.cardRepository.createQueryBuilder().take(limit).skip(offset);

    if (search) query.andWhere(`title ilike :text`, { text: `%${search}%` });

    return query.getMany();
  }

  async findOne(id: string): Promise<Card> {
    const card = await this.cardRepository.findOneBy({ id });
    if (!card) throw new NotFoundException(`Card with ${id} not found`);
    return card;
  }

  async update(id: string, updateCardInput: UpdateCardInput): Promise<Card> {
    try {
      const card = await this.findOne(id);
      return await this.cardRepository.save({
        ...card,
        ...updateCardInput,
      });
    } catch (error) {
      HandleExceptions(error);
    }
  }

  async remove(id: string): Promise<Card> {
    try {
      const card = await this.findOne(id);
      await this.cardRepository.softRemove(card);
      return { id, ...card };
    } catch (error) {
      HandleExceptions(error);
    }
  }
}
