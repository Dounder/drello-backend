import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateListInput {
  @Field(() => String)
  @MaxLength(1000)
  @MinLength(2)
  title: string;

  @Field(() => ID)
  @IsUUID()
  projectId: string;
}
