import { Field, ObjectType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';
import { Request } from 'src/requests/entities/request.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './../../common/entities/base.entity';
import { Project } from './../../projects/entities/project.entity';

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

  @Field(() => [Request])
  @OneToMany(() => Request, (request) => request.list, { lazy: true })
  requests: Request[];
}
