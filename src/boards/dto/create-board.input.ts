import { InputType, Int, Field } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateBoardInput {
  @Field(() => String)
  @MaxLength(1000)
  @MinLength(2)
  title: string;
}
