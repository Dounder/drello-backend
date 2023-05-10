import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsUUID, MinLength, MaxLength } from 'class-validator';

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
