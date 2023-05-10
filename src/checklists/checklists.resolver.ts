import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { ParseUUIDPipe } from '@nestjs/common';
import { Auth, GetUser } from 'src/auth/decorators';
import { ChecklistItemsService } from 'src/checklist-items/checklist-items.service';
import { ChecklistItem } from 'src/checklist-items/entities/checklist-item.entity';
import { PaginationArgs } from 'src/common/dto';
import { User } from 'src/users/entities/user.entity';
import { ChecklistsService } from './checklists.service';
import { CreateChecklistInput } from './dto/create-checklist.input';
import { UpdateChecklistInput } from './dto/update-checklist.input';
import { Checklist } from './entities/checklist.entity';
import { UserRoles } from 'src/common/types/user-roles';

@Resolver(() => Checklist)
@Auth()
export class ChecklistsResolver {
  constructor(
    private readonly checklistsService: ChecklistsService,
    private readonly checklistItemsService: ChecklistItemsService,
  ) {}

  @Mutation(() => Checklist)
  createChecklist(@Args('createChecklistInput') createChecklistInput: CreateChecklistInput, @GetUser() user: User) {
    return this.checklistsService.create(createChecklistInput, user);
  }

  @Query(() => [Checklist], { name: 'checklists' })
  findAll(@Args() paginationArgs: PaginationArgs) {
    return this.checklistsService.findAll(paginationArgs);
  }

  @Query(() => Checklist, { name: 'checklist' })
  findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.checklistsService.findOne(id);
  }

  @Mutation(() => Checklist)
  updateChecklist(@Args('updateChecklistInput') updateChecklistInput: UpdateChecklistInput) {
    return this.checklistsService.update(updateChecklistInput.id, updateChecklistInput);
  }

  @Mutation(() => Checklist)
  @Auth(UserRoles.admin)
  removeChecklist(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.checklistsService.remove(id);
  }

  @ResolveField(() => [ChecklistItem], { name: 'items' })
  getItems(@Parent() checklist: Checklist, @Args() paginationArgs: PaginationArgs) {
    return this.checklistItemsService.findAllByChecklistId(checklist.id, paginationArgs);
  }
}
