import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsDate,
  IsOptional,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateRequestInput {
  @Field(() => String)
  @MaxLength(1000)
  @MinLength(2)
  title: string;

  @Field(() => ID)
  @IsUUID()
  listId: string;

  @Field(() => String, { nullable: true })
  @MaxLength(100000)
  @IsOptional()
  description?: string;

  @Field(() => Date, { nullable: true })
  @IsDate()
  @IsOptional()
  dueDate?: Date;

  @Field(() => Date, { nullable: true })
  @IsDate()
  @IsOptional()
  endDate?: Date;
}
