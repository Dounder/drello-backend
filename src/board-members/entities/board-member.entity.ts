import { ObjectType } from '@nestjs/graphql';
import { Board } from 'src/boards/entities/board.entity';
import { CustomBaseEntity } from 'src/common/entities/custom-base.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, ManyToOne } from 'typeorm';

@ObjectType()
@Entity('board_members')
export class BoardMember extends CustomBaseEntity {
  @ManyToOne(() => Board, (board) => board.boardMembers, { lazy: true, onDelete: 'CASCADE' })
  board: Board;

  @ManyToOne(() => User, (user) => user.boardMembers, { lazy: true, onDelete: 'CASCADE' })
  user: User;
}
