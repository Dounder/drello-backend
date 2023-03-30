import { Field, InputType, ID } from '@nestjs/graphql';
import { MaxLength, MinLength, IsUUID, IsOptional } from 'class-validator';

@InputType()
export class CreateProjectInput {
  @Field(() => String)
  @MaxLength(1000)
  @MinLength(2)
  title: string;

  @Field(() => ID, { nullable: true })
  @IsUUID()
  @IsOptional()
  clientId?: string;
}
