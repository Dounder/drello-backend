import { Field, ObjectType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { Project } from './../../projects/entities/project.entity';
import { User } from './../../users/entities/user.entity';

import { BaseEntity } from './../../common/entities/base.entity';

@ObjectType()
@Entity('clients')
@Index('client_email_IX', ['email'], { unique: true })
export class Client extends BaseEntity {
  @Field(() => String)
  @Column({ type: 'text' })
  @MaxLength(100)
  @MinLength(2)
  name: string;

  @Field(() => String)
  @Column({ type: 'text' })
  @MaxLength(100)
  @MinLength(2)
  email: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  @MaxLength(50)
  @MinLength(2)
  nit: string;

  @ManyToOne(() => User, (user) => user.id, {
    lazy: true,
  })
  @JoinColumn({ name: 'createdBy' })
  @Field(() => User)
  createdBy: User;

  @Field(() => [Project])
  @OneToMany(() => Project, (project) => project.client, { lazy: true })
  projects: Project[];
}
