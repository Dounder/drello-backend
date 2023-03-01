import { ParseUUIDPipe } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth, GetUser } from 'src/auth/decorators';
import { PaginationArgs, SearchArgs } from 'src/common/dto';
import { UserRoles } from 'src/common/types/user-roles';
import { User } from './../users/entities/user.entity';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { List } from './entities/list.entity';
import { ListsService } from './lists.service';

@Resolver(() => List)
@Auth()
export class ListsResolver {
  constructor(private readonly listsService: ListsService) {}

  @Mutation(() => List)
  createList(
    @Args('createListInput') createListInput: CreateListInput,
    @GetUser() user: User,
  ) {
    return this.listsService.create(createListInput, user);
  }

  @Query(() => [List], { name: 'lists' })
  findAll(
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ) {
    return this.listsService.findAll(paginationArgs, searchArgs);
  }

  @Query(() => List, { name: 'list' })
  findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.listsService.findOne(id);
  }

  @Mutation(() => List)
  updateList(@Args('updateListInput') updateListInput: UpdateListInput) {
    return this.listsService.update(updateListInput.id, updateListInput);
  }

  @Mutation(() => List)
  @Auth(UserRoles.admin)
  removeList(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.listsService.remove(id);
  }

  // TODO: implement custom resolver
}
