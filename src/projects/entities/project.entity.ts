import { Field, ObjectType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './../../common/entities/base.entity';
import { User } from './../../users/entities/user.entity';
import { List } from './../../lists/entities/list.entity';

@ObjectType()
@Entity('projects')
export class Project extends BaseEntity {
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
  @OneToMany(() => List, (list) => list.project, { lazy: true })
  lists: List[];
}
