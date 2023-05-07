import { ParseUUIDPipe } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Auth, GetUser } from 'src/auth/decorators';
import { PaginationArgs, SearchArgs } from 'src/common/dto';
import { UserRoles } from 'src/common/types/user-roles';
import { User } from 'src/users/entities/user.entity';
import { CardsService } from './cards.service';
import { CreateCardInput } from './dto/create-card.input';
import { UpdateCardInput } from './dto/update-card.input';
import { Card } from './entities/card.entity';

@Resolver(() => Card)
@Auth()
export class CardsResolver {
  constructor(private readonly cardsService: CardsService) {}

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

  // TODO: Add query to get all cards of a list
  // TODO: Add mutation to add members to a card
  // TODO: Add mutation to remove members from a card
  // TODO: Add mutation to move a card to another list
  // TODO: Add custom resolver to get all members of a card
}
