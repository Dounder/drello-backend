import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Card } from 'src/cards/entities/card.entity';
import { CustomBaseEntity } from 'src/common/entities/custom-base.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, ManyToOne } from 'typeorm';

@ObjectType()
@Entity('card_members')
export class CardMember extends CustomBaseEntity {
  @ManyToOne(() => Card, (card) => card.cardMembers, { lazy: true })
  card: Card;

  @ManyToOne(() => User, (user) => user.cardMembers, { lazy: true })
  user: User;
}
