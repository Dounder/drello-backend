import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CreateProjectInput } from './create-project.input';

@InputType()
export class UpdateProjectInput extends PartialType(CreateProjectInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field(() => ID)
  @IsUUID()
  clientId: string;
}
