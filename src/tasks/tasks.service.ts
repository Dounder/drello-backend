import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleExceptions } from 'src/common/helpers/handle-exceptions.helper';
import { Repository } from 'typeorm';
import { PaginationArgs } from './../common/dto/pagination.args';
import { SearchArgs } from './../common/dto/search.args';
import { ErrorCodes } from './../common/helpers/errors-codes.helper';
import { SubRequestsService } from './../sub-requests/sub-requests.service';
import { User } from './../users/entities/user.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,

    private readonly subRequestService: SubRequestsService,
  ) {}

  async create(createTaskInput: CreateTaskInput, user: User): Promise<Task> {
    const subRequest = await this.subRequestService.findOne(createTaskInput.subRequestId);
    const task = this.taskRepository.create({
      ...createTaskInput,
      subRequest,
      createdBy: user,
    });
    return await this.taskRepository.save(task);
  }

  async findAll(paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<Task[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const query = this.taskRepository.createQueryBuilder().take(limit).skip(offset);

    if (search) query.andWhere(`text ilike :text`, { text: `%${search}%` });

    return await query.getMany();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id });

    if (!task)
      throw new NotFoundException({
        message: `Task with id ${id} not found`,
        error: ErrorCodes.NOT_FOUND,
      });

    return task;
  }

  async update(id: string, updateTaskInput: UpdateTaskInput): Promise<Task> {
    try {
      const task = await this.findOne(id);
      return this.taskRepository.save({ ...task, ...updateTaskInput });
    } catch (error) {
      HandleExceptions(error);
    }
  }

  async remove(id: string): Promise<Task> {
    const task = await this.findOne(id);
    await this.taskRepository.softRemove(task);
    return { id, ...task };
  }
}
