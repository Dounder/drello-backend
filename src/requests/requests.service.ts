import { HandleExceptions } from 'src/common/helpers/handle-exceptions.helper';
import { User } from './../users/entities/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListsService } from './../lists/lists.service';
import { CreateRequestInput } from './dto/create-request.input';
import { UpdateRequestInput } from './dto/update-request.input';
import { Request } from './entities/request.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,

    private readonly listService: ListsService,
  ) {}

  async create(
    createRequestInput: CreateRequestInput,
    user: User,
  ): Promise<Request> {
    const list = await this.listService.findOne(createRequestInput.listId);
    const request = this.requestRepository.create({
      ...createRequestInput,
      list,
      createdBy: user,
    });
    return this.requestRepository.save(request);
  }

  async findAll(
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<Request[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const query = this.requestRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset)
      .withDeleted();

    if (search) query.andWhere(`title ilike :text`, { text: `%${search}%` });

    return query.getMany();
  }

  async findOne(id: string): Promise<Request> {
    try {
      return await this.requestRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException(`Request with ${id} not found`);
    }
  }

  async update(
    id: string,
    updateRequestInput: UpdateRequestInput,
  ): Promise<Request> {
    try {
      const request = await this.findOne(id);
      return await this.requestRepository.save({
        ...request,
        ...updateRequestInput,
      });
    } catch (error) {
      HandleExceptions(error);
    }
  }

  async remove(id: string): Promise<Request> {
    const request = await this.findOne(id);
    await this.requestRepository.softRemove(request);
    return { id, ...request };
  }
}
