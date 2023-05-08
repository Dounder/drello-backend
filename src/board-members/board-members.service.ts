import { Board } from 'src/boards/entities/board.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationArgs } from 'src/common/dto';
import { CreateBoardMemberInput } from './dto/create-board-member.input';
import { UpdateBoardMemberInput } from './dto/update-board-member.input';
import { BoardMember } from './entities/board-member.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class BoardMembersService {
  constructor(
    @InjectRepository(BoardMember)
    private readonly boardMemberRepository: Repository<BoardMember>,
  ) {}

  async create(createBoardMemberInput: CreateBoardMemberInput): Promise<BoardMember> {
    const boardMember = this.boardMemberRepository.create({
      board: { id: createBoardMemberInput.boardId },
      user: { id: createBoardMemberInput.userId },
    });
    return await this.boardMemberRepository.save(boardMember);
  }

  /**
   * Find boards where the user is a member
   * @param userId Id of the user
   * @param pagination Pagination arguments
   * @returns Boards of the user
   */
  async findUserBoards(userId: string, pagination: PaginationArgs): Promise<Board[]> {
    const { limit, offset } = pagination;
    const boards = await this.boardMemberRepository.find({
      where: { user: { id: userId } },
      relations: ['board'],
      take: limit,
      skip: offset,
    });

    return boards.map((boardMember) => boardMember.board);
  }

  /**
   * Find users of the board
   * @param boardId Id of the board
   * @param pagination Pagination arguments
   * @returns Users of the board
   */
  async findBoardUsers(boardId: string, pagination: PaginationArgs): Promise<User[]> {
    const { limit, offset } = pagination;
    const boards = await this.boardMemberRepository.find({
      where: { board: { id: boardId } },
      relations: ['user'],
      take: limit,
      skip: offset,
    });

    return boards.map((boardMember) => boardMember.user);
  }

  async findOne(id: string): Promise<BoardMember> {
    const boardMember = await this.boardMemberRepository.findOneBy({ id });
    if (!boardMember) throw new NotFoundException(`BoardMember #${id} not found`);
    return boardMember;
  }

  async update(id: string, updateBoardMemberInput: UpdateBoardMemberInput): Promise<BoardMember> {
    const boardMember = await this.boardMemberRepository.findOneBy({ id });
    return await this.boardMemberRepository.save({
      ...boardMember,
      ...updateBoardMemberInput,
    });
  }

  async remove(id: string): Promise<BoardMember> {
    const boardMember = await this.boardMemberRepository.findOneBy({ id });
    await this.boardMemberRepository.softRemove(boardMember);
    return { id, ...boardMember };
  }
}
