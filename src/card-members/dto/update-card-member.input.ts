import { IsUUID } from 'class-validator';
import { CreateCardMemberInput } from './create-card-member.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateCardMemberInput extends PartialType(CreateCardMemberInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
