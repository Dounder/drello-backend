import { Field, ObjectType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { CustomBaseEntity } from 'src/common/entities/custom-base.entity';
import { List } from 'src/lists/entities/list.entity';
import { User } from 'src/users/entities/user.entity';
import { CardMember } from 'src/card-members/entities/card-member.entity';
import { Checklist } from 'src/checklists/entities/checklist.entity';

@ObjectType()
@Entity('cards')
export class Card extends CustomBaseEntity {
  @Field(() => String)
  @MinLength(2)
  @MaxLength(500)
  @Column({ type: 'text' })
  title: string;

  @Field(() => String, { nullable: true })
  @MinLength(2)
  @Column({ type: 'text', nullable: true })
  description?: string;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  dueDate?: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  endDate?: Date;

  @Field(() => List)
  @ManyToOne(() => List, (list) => list.id, { lazy: true })
  @JoinColumn({ name: 'listId' })
  list: List;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.id, { lazy: true })
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  @OneToMany(() => CardMember, (cardMember) => cardMember.card, { lazy: true })
  cardMembers: CardMember[];

  @OneToMany(() => Checklist, (checklist) => checklist.card, { lazy: true })
  checklists: Checklist[];
}
