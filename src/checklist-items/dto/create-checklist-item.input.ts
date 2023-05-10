import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateChecklistItemInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
