import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateChecklistItemInput {
  @Field(() => ID)
  @IsUUID()
  checklistId: string;

  @Field(() => String)
  @MinLength(1)
  @MaxLength(500)
  text: string;
}
