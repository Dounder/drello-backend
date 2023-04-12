import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateClientInput {
  @Field(() => String)
  @IsString()
  @MaxLength(100)
  @MinLength(2)
  name: string;

  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  @MinLength(2)
  nit: string;
}
