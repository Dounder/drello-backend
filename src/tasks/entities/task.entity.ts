import { SubRequest } from './../../sub-requests/entities/sub-request.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './../../common/entities/base.entity';
import { User } from './../../users/entities/user.entity';

@ObjectType()
@Entity('tasks')
export class Task extends BaseEntity {
  @Field(() => String)
  @Column({ type: 'text' })
  @MaxLength(1000)
  @MinLength(2)
  text: string;

  @Field(() => Boolean)
  @Column({ type: 'boolean' })
  done = false;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  dueDate?: Date;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.id, {
    lazy: true,
  })
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  @Field(() => SubRequest)
  @ManyToOne(() => SubRequest, (subRequest) => subRequest.id, { lazy: true })
  @JoinColumn({ name: 'subRequestId' })
  subRequest: SubRequest;
}
