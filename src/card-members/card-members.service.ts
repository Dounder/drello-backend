import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Card } from 'src/cards/entities/card.entity';
import { PaginationArgs } from 'src/common/dto';
import { User } from 'src/users/entities/user.entity';
import { CreateCardMemberInput } from './dto/create-card-member.input';
import { UpdateCardMemberInput } from './dto/update-card-member.input';
import { CardMember } from './entities/card-member.entity';

@Injectable()
export class CardMembersService {
  constructor(
    @InjectRepository(CardMember)
    private readonly cardMemberRepository: Repository<CardMember>,
  ) {}

  async create(createCardMemberInput: CreateCardMemberInput): Promise<CardMember> {
    const cardMember = this.cardMemberRepository.create({
      card: { id: createCardMemberInput.cardId },
      user: { id: createCardMemberInput.userId },
    });
    return this.cardMemberRepository.save(cardMember);
  }

  /**
   * Get all cards that a user is member of
   * @param id Id of user
   * @param paginationArgs args for pagination (limit, offset)
   * @returns List of cards
   */
  async findUserCards(id: string, paginationArgs: PaginationArgs): Promise<Card[]> {
    const { limit, offset } = paginationArgs;

    // Get all cardMember with specific userId and limit, offset
    const cardMembers = await this.cardMemberRepository.find({
      where: { user: { id } },
      take: limit,
      skip: offset,
      relations: ['card'],
    });

    return cardMembers.map((cardMember) => cardMember.card);
  }

  /**
   * Get all users member of a card
   * @param id Id of card
   * @param paginationArgs args for pagination (limit, offset)
   * @returns List of users
   */
  async findCardMembers(id: string, paginationArgs: PaginationArgs): Promise<User[]> {
    const { limit, offset } = paginationArgs;

    // Get all cardMember with specific cardId and limit, offset
    const cardMembers = await this.cardMemberRepository.find({
      where: { card: { id } },
      take: limit,
      skip: offset,
      relations: ['user'],
    });

    return cardMembers.map((cardMember) => cardMember.user);
  }

  async update(id: string, updateCardMemberInput: UpdateCardMemberInput): Promise<CardMember> {
    const cardMember = await this.cardMemberRepository.findOneBy({ id });
    return this.cardMemberRepository.save({ ...cardMember, ...updateCardMemberInput });
  }

  async remove(id: string): Promise<CardMember> {
    const cardMember = await this.cardMemberRepository.findOneBy({ id });
    this.cardMemberRepository.softRemove(cardMember);
    return { id, ...cardMember };
  }
}
