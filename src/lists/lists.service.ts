import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationArgs, SearchArgs } from 'src/common/dto';
import { HandleExceptions } from 'src/common/helpers/handle-exceptions.helper';
import { Repository } from 'typeorm';
import { ProjectsService } from './../projects/projects.service';
import { User } from './../users/entities/user.entity';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { List } from './entities/list.entity';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List) private readonly listRepository: Repository<List>,

    private readonly projectService: ProjectsService,
  ) {}

  async create(createListInput: CreateListInput, user: User): Promise<List> {
    const project = await this.projectService.findOne(
      createListInput.projectId,
    );
    const list = this.listRepository.create({
      ...createListInput,
      project,
      createdBy: user,
    });
    return await this.listRepository.save(list);
  }

  async findAll(
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<List[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const query = this.listRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset);

    if (search) query.andWhere(`title ilike :text`, { text: `%${search}%` });

    return query.getMany();
  }

  async findOne(id: string): Promise<List> {
    try {
      return await this.listRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException(`Client with ${id} not found`);
    }
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
