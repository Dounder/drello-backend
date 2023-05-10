import { IsUUID } from 'class-validator';
import { CreateChecklistItemInput } from './create-checklist-item.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateChecklistItemInput extends PartialType(CreateChecklistItemInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
