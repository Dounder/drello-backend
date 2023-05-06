import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ParseUUIDPipe } from '@nestjs/common';

import { Auth, GetUser } from 'src/auth/decorators';
import { PaginationArgs, SearchArgs } from 'src/common/dto';
import { User } from 'src/users/entities/user.entity';
import { BoardsService } from './boards.service';
import { CreateBoardInput } from './dto/create-board.input';
import { UpdateBoardInput } from './dto/update-board.input';
import { Board } from './entities/board.entity';
import { UserRoles } from 'src/common/types/user-roles';

@Auth()
@Resolver(() => Board)
export class BoardsResolver {
  constructor(private readonly boardsService: BoardsService) {}

  @Mutation(() => Board)
  createBoard(@Args('createBoardInput') createBoardInput: CreateBoardInput, @GetUser() user: User) {
    return this.boardsService.create(createBoardInput, user);
  }

  @Query(() => [Board], { name: 'boards' })
  findAll(@Args() paginationArgs: PaginationArgs, @Args() searchArgs: SearchArgs) {
    return this.boardsService.findAll(paginationArgs, searchArgs);
  }

  @Query(() => Board, { name: 'board' })
  findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.boardsService.findOne(id);
  }

  @Mutation(() => Board)
  updateBoard(@Args('updateBoardInput') updateBoardInput: UpdateBoardInput) {
    return this.boardsService.update(updateBoardInput.id, updateBoardInput);
  }

  @Mutation(() => Board)
  @Auth(UserRoles.admin)
  removeBoard(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.boardsService.remove(id);
  }

  // TODO: implement custom resolver
}
