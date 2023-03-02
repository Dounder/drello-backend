import { SubRequest } from './../../sub-requests/entities/sub-request.entity';
import { List } from './../../lists/entities/list.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './../../common/entities/base.entity';
import { User } from './../../users/entities/user.entity';

@ObjectType()
@Entity('requests')
export class Request extends BaseEntity {
  @Field(() => String)
  @Column({ type: 'text' })
  @MaxLength(1000)
  @MinLength(2)
  title: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  @MaxLength(100000)
  description?: string;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  dueDate?: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  endDate?: Date;

  @Field(() => List)
  @ManyToOne(() => List, (list) => list.id, {
    lazy: true,
  })
  @JoinColumn({ name: 'listId' })
  list: List;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.id, {
    lazy: true,
  })
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  @Field(() => [SubRequest])
  @OneToMany(() => SubRequest, (subRequest) => subRequest.request, {
    lazy: true,
  })
  subRequests: SubRequest[];
}
