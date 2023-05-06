import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { PaginationArgs, SearchArgs } from 'src/common/dto';
import { HandleExceptions } from 'src/common/helpers/handle-exceptions.helper';
import { User } from 'src/users/entities/user.entity';
import { CreateBoardInput } from './dto/create-board.input';
import { UpdateBoardInput } from './dto/update-board.input';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async create(createBoardInput: CreateBoardInput, user: User): Promise<Board> {
    try {
      const project = this.boardRepository.create({
        ...createBoardInput,
        createdBy: user,
      });

      return await this.boardRepository.save(project);
    } catch (error) {
      HandleExceptions(error);
    }
  }

  async findAll(paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<Board[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const query = this.boardRepository.createQueryBuilder().take(limit).skip(offset);

    if (search) query.andWhere(`title ilike :text`, { text: `%${search}%` });

    return query.getMany();
  }

  async findOne(id: string): Promise<Board> {
    const board = await this.boardRepository.findOneBy({ id });
    if (!board) throw new NotFoundException(`Board with ${id} not found`);
    return board;
  }

  async update(id: string, updateBoardInput: UpdateBoardInput): Promise<Board> {
    try {
      const board = await this.findOne(id);

      return await this.boardRepository.save({
        ...board,
        ...updateBoardInput,
      });
    } catch (error) {
      HandleExceptions(error);
    }
  }

  async remove(id: string): Promise<Board> {
    try {
      const board = await this.findOne(id);
      await this.boardRepository.softRemove(board);
      return { id, ...board };
    } catch (error) {
      HandleExceptions(error);
    }
  }
}
