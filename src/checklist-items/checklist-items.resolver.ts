import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ChecklistItemsService } from './checklist-items.service';
import { ChecklistItem } from './entities/checklist-item.entity';
import { CreateChecklistItemInput } from './dto/create-checklist-item.input';
import { UpdateChecklistItemInput } from './dto/update-checklist-item.input';

@Resolver(() => ChecklistItem)
export class ChecklistItemsResolver {
  constructor(private readonly checklistItemsService: ChecklistItemsService) {}

  @Mutation(() => ChecklistItem)
  createChecklistItem(@Args('createChecklistItemInput') createChecklistItemInput: CreateChecklistItemInput) {
    return this.checklistItemsService.create(createChecklistItemInput);
  }

  @Query(() => [ChecklistItem], { name: 'checklistItems' })
  findAll() {
    return this.checklistItemsService.findAll();
  }

  @Query(() => ChecklistItem, { name: 'checklistItem' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.checklistItemsService.findOne(id);
  }

  @Mutation(() => ChecklistItem)
  updateChecklistItem(@Args('updateChecklistItemInput') updateChecklistItemInput: UpdateChecklistItemInput) {
    return this.checklistItemsService.update(updateChecklistItemInput.id, updateChecklistItemInput);
  }

  @Mutation(() => ChecklistItem)
  removeChecklistItem(@Args('id', { type: () => Int }) id: number) {
    return this.checklistItemsService.remove(id);
  }
}
