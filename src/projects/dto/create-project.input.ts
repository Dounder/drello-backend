import { Field, InputType, ID } from '@nestjs/graphql';
import { MaxLength, MinLength, IsUUID } from 'class-validator';

@InputType()
export class CreateProjectInput {
  @Field(() => String)
  @MaxLength(1000)
  @MinLength(2)
  title: string;

  @Field(() => ID)
  @IsUUID()
  clientId: string;
}
