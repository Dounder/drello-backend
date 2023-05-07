import { Field, ObjectType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

import { CustomBaseEntity } from 'src/common/entities/custom-base.entity';
import { List } from 'src/lists/entities/list.entity';
import { User } from 'src/users/entities/user.entity';

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

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, { lazy: true })
  @JoinTable({ name: 'card_members' })
  members: User[];
}
