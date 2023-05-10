import { Field, ObjectType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { ChecklistItem } from 'src/checklist-items/entities/checklist-item.entity';
import { CustomBaseEntity } from 'src/common/entities/custom-base.entity';
import { User } from 'src/users/entities/user.entity';
import { Card } from 'src/cards/entities/card.entity';

@ObjectType()
@Entity('checklists')
export class Checklist extends CustomBaseEntity {
  @Field(() => String)
  @MinLength(1)
  @MaxLength(255)
  @Column({ type: 'text' })
  title: string;

  @ManyToOne(() => Card, (card) => card.checklists, { lazy: true, onDelete: 'CASCADE' })
  card: Card;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.checklists, { eager: true })
  createdBy: User;

  @OneToMany(() => ChecklistItem, (item) => item.checklist, { lazy: true })
  items: ChecklistItem[];
}
