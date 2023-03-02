import { Field, ObjectType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './../../common/entities/base.entity';
import { Request } from './../../requests/entities/request.entity';
import { User } from './../../users/entities/user.entity';

@ObjectType()
@Entity('subRequests')
export class SubRequest extends BaseEntity {
  @Field(() => String)
  @Column({ type: 'text' })
  @MaxLength(1000)
  @MinLength(2)
  title: string;

  @Field(() => Request)
  @ManyToOne(() => Request, (request) => request.id, { lazy: true })
  @JoinColumn({ name: 'requestId' })
  request: Request;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.id, {
    lazy: true,
  })
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;
}
