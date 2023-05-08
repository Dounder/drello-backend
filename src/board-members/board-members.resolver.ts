import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';

import { Auth } from 'src/auth/decorators';
import { BoardMembersService } from './board-members.service';
import { CreateBoardMemberInput } from './dto/create-board-member.input';
import { UpdateBoardMemberInput } from './dto/update-board-member.input';
import { BoardMember } from './entities/board-member.entity';

@Resolver(() => BoardMember)
@Auth()
export class BoardMembersResolver {
  constructor(private readonly boardMembersService: BoardMembersService) {}

  @Mutation(() => BoardMember)
  createBoardMember(@Args('createBoardMemberInput') createBoardMemberInput: CreateBoardMemberInput) {
    return this.boardMembersService.create(createBoardMemberInput);
  }

  @Mutation(() => BoardMember)
  updateBoardMember(@Args('updateBoardMemberInput') updateBoardMemberInput: UpdateBoardMemberInput) {
    return this.boardMembersService.update(updateBoardMemberInput.id, updateBoardMemberInput);
  }

  @Mutation(() => BoardMember)
  removeBoardMember(@Args('id', { type: () => ID }) id: string) {
    return this.boardMembersService.remove(id);
  }
}
