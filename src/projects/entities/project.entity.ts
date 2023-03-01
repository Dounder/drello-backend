import { Field, ObjectType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './../../users/entities/user.entity';
import { Client } from './../../clients/entities/client.entity';
import { BaseEntity } from './../../common/entities/base.entity';

@ObjectType()
@Entity('projects')
export class Project extends BaseEntity {
  @Field(() => String)
  @Column({ type: 'text' })
  @MaxLength(1000)
  @MinLength(2)
  title: string;

  @Field(() => Client)
  @ManyToOne(() => Client, (client) => client.projects, { lazy: true })
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @ManyToOne(() => User, (user) => user.id, {
    lazy: true,
  })
  @JoinColumn({ name: 'createdBy' })
  @Field(() => User)
  createdBy: User;
}
