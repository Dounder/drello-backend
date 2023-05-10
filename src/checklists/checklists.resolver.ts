import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Auth, GetUser } from 'src/auth/decorators';
import { PaginationArgs } from 'src/common/dto';
import { User } from 'src/users/entities/user.entity';
import { ChecklistsService } from './checklists.service';
import { CreateChecklistInput } from './dto/create-checklist.input';
import { UpdateChecklistInput } from './dto/update-checklist.input';
import { Checklist } from './entities/checklist.entity';

@Resolver(() => Checklist)
@Auth()
export class ChecklistsResolver {
  constructor(private readonly checklistsService: ChecklistsService) {}

  @Mutation(() => Checklist)
  createChecklist(@Args('createChecklistInput') createChecklistInput: CreateChecklistInput, @GetUser() user: User) {
    return this.checklistsService.create(createChecklistInput, user);
  }

  @Query(() => [Checklist], { name: 'checklists' })
  findAll(@Args() paginationArgs: PaginationArgs) {
    return this.checklistsService.findAll(paginationArgs);
  }

  @Query(() => Checklist, { name: 'checklist' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.checklistsService.findOne(id);
  }

  @Mutation(() => Checklist)
  updateChecklist(@Args('updateChecklistInput') updateChecklistInput: UpdateChecklistInput) {
    return this.checklistsService.update(updateChecklistInput.id, updateChecklistInput);
  }

  @Mutation(() => Checklist)
  removeChecklist(@Args('id', { type: () => ID }) id: string) {
    return this.checklistsService.remove(id);
  }
}
