import { MaxLength, MinLength } from 'class-validator';
import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './../../common/entities/base.entity';
import { Project } from './../../projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
@Entity('lists')
export class List extends BaseEntity {
  @Field(() => String)
  @Column({ type: 'text' })
  @MaxLength(1000)
  @MinLength(2)
  title: string;

  @Field(() => Project)
  @ManyToOne(() => Project, (project) => project.lists, { lazy: true })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @ManyToOne(() => User, (user) => user.id, {
    lazy: true,
  })
  @JoinColumn({ name: 'createdBy' })
  @Field(() => User)
  createdBy: User;
}
