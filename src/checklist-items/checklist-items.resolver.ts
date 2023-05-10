import { ParseUUIDPipe } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Auth, GetUser } from 'src/auth/decorators';
import { UserRoles } from 'src/common/types/user-roles';
import { User } from 'src/users/entities/user.entity';
import { ChecklistItemsService } from './checklist-items.service';
import { CreateChecklistItemInput } from './dto/create-checklist-item.input';
import { UpdateChecklistItemInput } from './dto/update-checklist-item.input';
import { ChecklistItem } from './entities/checklist-item.entity';
import { PaginationArgs } from 'src/common/dto';

@Resolver(() => ChecklistItem)
@Auth()
export class ChecklistItemsResolver {
  constructor(private readonly checklistItemsService: ChecklistItemsService) {}

  @Mutation(() => ChecklistItem)
  createChecklistItem(
    @Args('createChecklistItemInput') createChecklistItemInput: CreateChecklistItemInput,
    @GetUser() user: User,
  ) {
    return this.checklistItemsService.create(createChecklistItemInput, user);
  }

  @Query(() => [ChecklistItem], { name: 'checklistItems' })
  findAll(@Args() paginationArgs: PaginationArgs) {
    return this.checklistItemsService.findAll(paginationArgs);
  }

  @Query(() => [ChecklistItem], { name: 'checklistItemsByChecklistId' })
  findAllByChecklistId(
    @Args('checklistId', { type: () => ID }, ParseUUIDPipe) checklistId: string,
    @Args() paginationArgs: PaginationArgs,
  ) {
    return this.checklistItemsService.findAllByChecklistId(checklistId, paginationArgs);
  }

  @Query(() => ChecklistItem, { name: 'checklistItem' })
  findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.checklistItemsService.findOne(id);
  }

  @Mutation(() => ChecklistItem)
  @Auth(UserRoles.admin)
  updateChecklistItem(@Args('updateChecklistItemInput') updateChecklistItemInput: UpdateChecklistItemInput) {
    return this.checklistItemsService.update(updateChecklistItemInput.id, updateChecklistItemInput);
  }

  @Mutation(() => ChecklistItem)
  @Auth(UserRoles.admin)
  removeChecklistItem(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.checklistItemsService.remove(id);
  }
}
