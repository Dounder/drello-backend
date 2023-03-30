import { Client } from './../../clients/entities/client.entity';
import { UserRoles } from './../../common/types/user-roles';
import { Field, ObjectType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './../../common/entities/base.entity';

@ObjectType()
@Entity('users')
@Index('user_email_IX', ['email'], { unique: true })
@Index('user_username_IX', ['username'], { unique: true })
export class User extends BaseEntity {
  @Field(() => String)
  @Column({ type: 'text' })
  @MaxLength(100)
  @MinLength(2)
  username: string;

  @Field(() => String)
  @Column({ type: 'text' })
  @MaxLength(100)
  @MinLength(2)
  email: string;

  @Column({ type: 'text' })
  @MaxLength(100)
  @MinLength(2)
  password: string;

  @Column({
    type: 'enum',
    enum: UserRoles,
    default: [UserRoles.user],
    array: true,
  })
  @Field(() => [UserRoles])
  roles: UserRoles[];

  @ManyToOne(() => User, (user) => user.lastUpdatedBy, {
    nullable: true,
    lazy: true,
  })
  @JoinColumn({ name: 'lastUpdatedBy' })
  @Field(() => User, { nullable: true })
  lastUpdatedBy?: User;

  @OneToMany(() => Client, (client) => client.createdBy, { lazy: true })
  clientsCreated: Client[];
}
