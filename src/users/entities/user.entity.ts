import { Field, ObjectType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CustomBaseEntity } from '../../common/entities/custom-base.entity';
import { UserRoles } from './../../common/types/user-roles';
import { CardMember } from 'src/card-members/entities/card-member.entity';
import { BoardMember } from 'src/board-members/entities/board-member.entity';
import { Checklist } from 'src/checklists/entities/checklist.entity';
import { ChecklistItem } from 'src/checklist-items/entities/checklist-item.entity';

@ObjectType()
@Entity('users')
@Index('user_email_IX', ['email'], { unique: true })
@Index('user_username_IX', ['username'], { unique: true })
export class User extends CustomBaseEntity {
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

  @OneToMany(() => CardMember, (cardMember) => cardMember.user, { lazy: true, onDelete: 'CASCADE' })
  cardMembers: CardMember[];

  @OneToMany(() => BoardMember, (boardMember) => boardMember.user, { lazy: true, onDelete: 'CASCADE' })
  boardMembers: BoardMember[];

  @OneToMany(() => Checklist, (checklist) => checklist.createdBy, { lazy: true, onDelete: 'CASCADE' })
  checklists: Checklist[];

  @OneToMany(() => ChecklistItem, (checklistItem) => checklistItem.createdBy, { lazy: true, onDelete: 'CASCADE' })
  checklistItems: ChecklistItem[];
}
