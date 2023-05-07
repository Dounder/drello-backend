import { ParseUUIDPipe } from '@nestjs/common';
import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { Auth, GetUser } from 'src/auth/decorators';
import { CardMembersService } from 'src/card-members/card-members.service';
import { PaginationArgs, SearchArgs } from 'src/common/dto';
import { UserRoles } from 'src/common/types/user-roles';
import { User } from 'src/users/entities/user.entity';
import { CardsService } from './cards.service';
import { CreateCardInput } from './dto/create-card.input';
import { UpdateCardInput } from './dto/update-card.input';
import { Card } from './entities/card.entity';
import { CannotExecuteNotConnectedError } from 'typeorm';

@Resolver(() => Card)
@Auth()
export class CardsResolver {
  constructor(
    private readonly cardsService: CardsService,

    private readonly cardMembersService: CardMembersService,
  ) {}

  @Mutation(() => Card)
  createCard(@Args('createCardInput') createCardInput: CreateCardInput, @GetUser() user: User) {
    return this.cardsService.create(createCardInput, user);
  }

  @Query(() => [Card], { name: 'cards' })
  findAll(@Args() paginationArgs: PaginationArgs, @Args() searchArgs: SearchArgs) {
    return this.cardsService.findAll(paginationArgs, searchArgs);
  }

  @Query(() => Card, { name: 'card' })
  findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.cardsService.findOne(id);
  }

  @Mutation(() => Card)
  updateCard(@Args('updateCardInput') updateCardInput: UpdateCardInput) {
    return this.cardsService.update(updateCardInput.id, updateCardInput);
  }

  @Mutation(() => Card)
  @Auth(UserRoles.admin)
  removeCard(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.cardsService.remove(id);
  }

  @ResolveField(() => [User], { name: 'members' })
  getMembers(@Parent() card: Card, @Args() paginationArgs: PaginationArgs) {
    return this.cardMembersService.findCardMembers(card.id, paginationArgs);
  }
}
