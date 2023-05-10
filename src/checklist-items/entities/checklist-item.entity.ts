import { ObjectType, Field, Int } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Checklist } from 'src/checklists/entities/checklist.entity';
import { CustomBaseEntity } from 'src/common/entities/custom-base.entity';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
@Entity('checklist_items')
export class ChecklistItem extends CustomBaseEntity {
  @Field(() => String)
  @MinLength(1)
  @MaxLength(500)
  @Column({ type: 'text' })
  text: string;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: false })
  done: boolean;

  @ManyToOne(() => Checklist, (checklist) => checklist.items, { lazy: true })
  checklist: Checklist;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.checklists, { lazy: true })
  createdBy: User;
}
