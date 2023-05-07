import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateCardInput {
  @Field(() => ID)
  @IsUUID()
  listId: string;

  @Field(() => String)
  @MinLength(2)
  @MaxLength(500)
  title: string;
}
