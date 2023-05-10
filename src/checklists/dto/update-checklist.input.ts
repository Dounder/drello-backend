import { CreateChecklistInput } from './create-checklist.input';
import { InputType, Field, Int, PartialType, OmitType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateChecklistInput extends OmitType(PartialType(CreateChecklistInput), ['cardId']) {
  @Field(() => ID)
  id: string;
}
