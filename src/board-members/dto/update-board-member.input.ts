import { IsUUID } from 'class-validator';
import { CreateBoardMemberInput } from './create-board-member.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateBoardMemberInput extends PartialType(CreateBoardMemberInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
