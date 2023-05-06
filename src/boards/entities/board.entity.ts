import { Field, ObjectType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { List } from 'src/lists/entities/list.entity';
import { User } from 'src/users/entities/user.entity';
import { BaseEntity } from './../../common/entities/base.entity';

@ObjectType()
@Entity('boards')
export class Board extends BaseEntity {
  @Field(() => String)
  @Column({ type: 'text' })
  @MaxLength(1000)
  @MinLength(2)
  title: string;

  @ManyToOne(() => User, (user) => user.id, {
    lazy: true,
  })
  @JoinColumn({ name: 'createdBy' })
  @Field(() => User)
  createdBy: User;

  @Field(() => [List])
  @OneToMany(() => List, (list) => list.board, { lazy: true })
  lists: List[];
}
