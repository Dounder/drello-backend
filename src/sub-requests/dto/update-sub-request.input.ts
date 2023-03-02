import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CreateSubRequestInput } from './create-sub-request.input';

@InputType()
export class UpdateSubRequestInput extends PartialType(CreateSubRequestInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
