import { Field, ID, InputType } from '@nestjs/graphql';
import { IsDate, IsOptional, IsUUID, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateCardInput {
  @Field(() => ID)
  @IsUUID()
  listId: string;

  @Field(() => String)
  @MinLength(2)
  @MaxLength(500)
  title: string;

  @Field(() => String, { nullable: true })
  @MinLength(2)
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

  @Field(() => [String], { nullable: true })
  @IsUUID('all', { each: true })
  @IsOptional()
  members?: string[];
}
