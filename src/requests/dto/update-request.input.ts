import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CreateRequestInput } from './create-request.input';

@InputType()
export class UpdateRequestInput extends PartialType(CreateRequestInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
