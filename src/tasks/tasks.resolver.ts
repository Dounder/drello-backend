import { ParseUUIDPipe } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth, GetUser } from 'src/auth/decorators';
import { PaginationArgs, SearchArgs } from 'src/common/dto';
import { User } from './../users/entities/user.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';

@Resolver(() => Task)
@Auth()
export class TasksResolver {
  constructor(private readonly tasksService: TasksService) {}

  @Mutation(() => Task)
  createTask(@Args('createTaskInput') createTaskInput: CreateTaskInput, @GetUser() user: User) {
    return this.tasksService.create(createTaskInput, user);
  }

  @Query(() => [Task], { name: 'tasks' })
  findAll(@Args() paginationArgs: PaginationArgs, @Args() searchArgs: SearchArgs) {
    return this.tasksService.findAll(paginationArgs, searchArgs);
  }

  @Query(() => Task, { name: 'task' })
  findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.tasksService.findOne(id);
  }

  @Mutation(() => Task)
  updateTask(@Args('updateTaskInput') updateTaskInput: UpdateTaskInput) {
    return this.tasksService.update(updateTaskInput.id, updateTaskInput);
  }

  @Mutation(() => Task)
  removeTask(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.tasksService.remove(id);
  }
}
