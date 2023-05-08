import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class CreateBoardMemberInput {
  @Field(() => ID, { description: 'Id of board' })
  boardId: string;

  @Field(() => ID, { description: 'Id of user' })
  userId: string;
}
