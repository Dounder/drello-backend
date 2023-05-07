import { CreateUserInput } from './dto/inputs/create-user.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { Args, ID, Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { Auth, GetUser } from './../auth/decorators';
import { PaginationArgs, SearchArgs } from './../common/dto';
import { UserRoles } from './../common/types/user-roles';
import { RoleArg, UpdateUserInput } from './dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { Card } from 'src/cards/entities/card.entity';
import { CardMembersService } from 'src/card-members/card-members.service';

@Resolver(() => User)
@Auth()
export class UsersResolver {
  constructor(private readonly usersService: UsersService, private readonly cardMemberService: CardMembersService) {}

  @Mutation(() => User, { name: 'createUser' })
  @Auth(UserRoles.admin)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput): Promise<User> {
    return await this.usersService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  @Auth(UserRoles.admin)
  async findAll(
    @Args() validRoles: RoleArg,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<User[]> {
    return await this.usersService.findAll(validRoles.roles, paginationArgs, searchArgs);
  }

  @Query(() => User, { name: 'user' })
  @Auth(UserRoles.admin)
  async findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string): Promise<User> {
    return await this.usersService.findOneByTerm(id);
  }

  @Mutation(() => User, { name: 'updateUser' })
  @Auth(UserRoles.admin)
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @GetUser([UserRoles.admin]) user: User,
  ): Promise<User> {
    return this.usersService.update(updateUserInput.id, updateUserInput, user);
  }

  @Mutation(() => User, { name: 'removeUser' })
  @Auth(UserRoles.admin)
  async removeUser(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string): Promise<User> {
    return await this.usersService.remove(id);
  }

  @ResolveField(() => [Card], { name: 'cards', description: 'List of cards that user is member of' })
  async cards(@GetUser() user: User, @Args() pagination: PaginationArgs): Promise<Card[]> {
    return await this.cardMemberService.findUserCards(user.id, pagination);
  }
}
