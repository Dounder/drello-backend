import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsUUID, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateChecklistInput {
  @Field(() => ID)
  @IsUUID()
  cardId: string;

  @Field(() => String)
  @MinLength(1)
  @MaxLength(255)
  title: string;
}
