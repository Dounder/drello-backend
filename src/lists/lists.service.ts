import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationArgs, SearchArgs } from 'src/common/dto';
import { HandleExceptions } from 'src/common/helpers/handle-exceptions.helper';
import { ErrorCodes } from './../common/helpers/errors-codes.helper';
import { User } from './../users/entities/user.entity';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { List } from './entities/list.entity';
import { BoardsService } from 'src/boards/boards.service';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List) private readonly listRepository: Repository<List>,

    private readonly boardService: BoardsService,
  ) {}

  async create(createListInput: CreateListInput, user: User): Promise<List> {
    const board = await this.boardService.findOne(createListInput.boardId);
    const list = this.listRepository.create({
      ...createListInput,
      board,
      createdBy: user,
    });
    return await this.listRepository.save(list);
  }

  async findAll(paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<List[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const query = this.listRepository.createQueryBuilder().take(limit).skip(offset);

    if (search) query.andWhere(`title ilike :text`, { text: `%${search}%` });

    return query.getMany();
  }

  async findOne(id: string): Promise<List> {
    const list = await this.listRepository.findOneBy({ id });
    if (!list)
      throw new NotFoundException({
        message: `List with ${id} not found`,
        error: ErrorCodes.NOT_FOUND,
      });
    return list;
  }

  async update(id: string, updateListInput: UpdateListInput): Promise<List> {
    try {
      const list = await this.findOne(id);
      return this.listRepository.save({ ...list, ...updateListInput });
    } catch (error) {
      HandleExceptions(error);
    }
  }

  async remove(id: string): Promise<List> {
    try {
      const list = await this.findOne(id);
      await this.listRepository.softRemove(list);
      return { id, ...list };
    } catch (error) {
      HandleExceptions(error);
    }
  }
}
