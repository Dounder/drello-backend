import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { UserRoles } from './../../../common/types/user-roles';

@InputType()
export class CreateUserInput {
  @Field(() => String, { description: 'User username' })
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  username: string;

  @Field(() => String, { description: 'User email' })
  @IsEmail()
  email: string;

  @Field(() => String, { description: 'User password' })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @Field(() => [UserRoles], { description: 'Roles that the user can have' })
  @IsArray()
  @IsOptional()
  roles? = [UserRoles.user];
}
