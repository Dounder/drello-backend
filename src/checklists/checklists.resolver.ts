import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ChecklistsService } from './checklists.service';
import { Checklist } from './entities/checklist.entity';
import { CreateChecklistInput } from './dto/create-checklist.input';
import { UpdateChecklistInput } from './dto/update-checklist.input';

@Resolver(() => Checklist)
export class ChecklistsResolver {
  constructor(private readonly checklistsService: ChecklistsService) {}

  @Mutation(() => Checklist)
  createChecklist(@Args('createChecklistInput') createChecklistInput: CreateChecklistInput) {
    return this.checklistsService.create(createChecklistInput);
  }

  @Query(() => [Checklist], { name: 'checklists' })
  findAll() {
    return this.checklistsService.findAll();
  }

  @Query(() => Checklist, { name: 'checklist' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.checklistsService.findOne(id);
  }

  @Mutation(() => Checklist)
  updateChecklist(@Args('updateChecklistInput') updateChecklistInput: UpdateChecklistInput) {
    return this.checklistsService.update(updateChecklistInput.id, updateChecklistInput);
  }

  @Mutation(() => Checklist)
  removeChecklist(@Args('id', { type: () => Int }) id: number) {
    return this.checklistsService.remove(id);
  }
}
