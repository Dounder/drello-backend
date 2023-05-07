import { Field, ObjectType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Board } from 'src/boards/entities/board.entity';
import { User } from 'src/users/entities/user.entity';
import { BaseEntity } from './../../common/entities/base.entity';

@ObjectType()
@Entity('lists')
export class List extends BaseEntity {
  @Field(() => String)
  @Column({ type: 'text' })
  @MaxLength(1000)
  @MinLength(2)
  title: string;

  @Field(() => Board)
  @ManyToOne(() => Board, (board) => board.lists, { lazy: true })
  @JoinColumn({ name: 'boardId' })
  board: Board;

  @ManyToOne(() => User, (user) => user.id, {
    lazy: true,
  })
  @JoinColumn({ name: 'createdBy' })
  @Field(() => User)
  createdBy: User;
}
