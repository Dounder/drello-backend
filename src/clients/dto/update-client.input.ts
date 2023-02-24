import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CreateClientInput } from './create-client.input';

@InputType()
export class UpdateClientInput extends PartialType(CreateClientInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
