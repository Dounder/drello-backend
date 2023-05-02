import { Field, InputType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateProjectInput {
  @Field(() => String)
  @MaxLength(1000)
  @MinLength(2)
  title: string;
}
