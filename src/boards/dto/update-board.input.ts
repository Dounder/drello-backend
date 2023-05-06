import { IsUUID } from 'class-validator';
import { CreateBoardInput } from './create-board.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateBoardInput extends PartialType(CreateBoardInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
