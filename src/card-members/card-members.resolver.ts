import { ParseUUIDPipe } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Auth } from 'src/auth/decorators';
import { Card } from 'src/cards/entities/card.entity';
import { PaginationArgs } from 'src/common/dto';
import { UserRoles } from 'src/common/types/user-roles';
import { User } from 'src/users/entities/user.entity';
import { CardMembersService } from './card-members.service';
import { CreateCardMemberInput } from './dto/create-card-member.input';
import { UpdateCardMemberInput } from './dto/update-card-member.input';
import { CardMember } from './entities/card-member.entity';

@Resolver(() => CardMember)
@Auth()
export class CardMembersResolver {
  constructor(private readonly cardMembersService: CardMembersService) {}

  @Mutation(() => CardMember)
  createCardMember(@Args('createCardMemberInput') createCardMemberInput: CreateCardMemberInput) {
    return this.cardMembersService.create(createCardMemberInput);
  }

  @Query(() => [Card], { name: 'userCards' })
  findUserCards(
    @Args('id', { type: () => ID, description: 'Id of user to get cards' }, ParseUUIDPipe) id: string,
    @Args() paginationArgs: PaginationArgs,
  ) {
    return this.cardMembersService.findUserCards(id, paginationArgs);
  }

  @Query(() => [User], { name: 'cardMembers' })
  findCardMembers(
    @Args('id', { type: () => ID, description: 'Id of card to get members' }, ParseUUIDPipe) id: string,
    @Args() paginationArgs: PaginationArgs,
  ) {
    return this.cardMembersService.findCardMembers(id, paginationArgs);
  }

  @Mutation(() => CardMember)
  updateCardMember(@Args('updateCardMemberInput') updateCardMemberInput: UpdateCardMemberInput) {
    return this.cardMembersService.update(updateCardMemberInput.id, updateCardMemberInput);
  }

  @Mutation(() => CardMember)
  @Auth(UserRoles.admin)
  removeCardMember(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.cardMembersService.remove(id);
  }
}
