import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class CreateCardMemberInput {
  @Field(() => ID)
  @IsUUID()
  cardId: string;

  @Field(() => ID)
  @IsUUID()
  userId: string;
}
