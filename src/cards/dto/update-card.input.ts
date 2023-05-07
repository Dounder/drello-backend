import { IsUUID } from 'class-validator';
import { CreateCardInput } from './create-card.input';
import { InputType, Field, Int, PartialType, ID, OmitType } from '@nestjs/graphql';

@InputType()
export class UpdateCardInput extends PartialType(OmitType(CreateCardInput, ['members'])) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
