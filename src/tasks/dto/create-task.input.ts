import { Field, ID, InputType } from '@nestjs/graphql';
import { IsBoolean, IsDate, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateTaskInput {
  @Field(() => String)
  @IsString()
  @MaxLength(1000)
  @MinLength(2)
  text: string;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  done = false;

  @Field(() => Date, { nullable: true })
  @IsDate()
  @IsOptional()
  dueDate?: Date;

  @Field(() => ID)
  @IsUUID()
  subRequestId: string;
}
