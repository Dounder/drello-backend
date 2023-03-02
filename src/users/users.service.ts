import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { ArrayOverlap, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { PaginationArgs, SearchArgs } from './../common/dto';
import { HandleExceptions } from './../common/helpers/handle-exceptions.helper';
import { UserRoles } from './../common/types/user-roles';
import { CreateUserInput, UpdateUserInput } from './dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    try {
      const user = this.userRepository.create({
        ...createUserInput,
        password: bcrypt.hashSync(createUserInput.password, 10),
      });
      return await this.userRepository.save(user);
    } catch (error) {
      HandleExceptions(error);
    }
  }

  async findAll(
    roles: UserRoles[],
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<User[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const query = this.userRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset);

    if (search) query.andWhere(`username ilike :text`, { text: `%${search}%` });

    if (roles.length === 0) return query.getMany();

    return query
      .andWhere({
        roles: ArrayOverlap(roles),
      })
      .getMany();
  }

  async findOneByTerm(term: string): Promise<User> {
    try {
      return isUUID(term)
        ? await this.userRepository.findOneOrFail({
            where: { id: term },
            withDeleted: true,
          })
        : await this.userRepository.findOneOrFail({
            where: [{ username: term }, { email: term }],
            withDeleted: true,
          });
    } catch (error) {
      throw new NotFoundException(`User with ${term} not found`);
    }
  }

  async update(
    id: string,
    updateUserInput: UpdateUserInput,
    adminUser?: User,
  ): Promise<User> {
    try {
      const user = await this.findOneByTerm(id);

      if (updateUserInput.password)
        updateUserInput.password = bcrypt.hashSync(
          updateUserInput.password,
          10,
        );

      user.lastUpdatedBy = adminUser;
      return await this.userRepository.save({ ...user, ...updateUserInput });
    } catch (error) {
      HandleExceptions(error);
    }
  }

  async remove(id: string): Promise<User> {
    const user = await this.findOneByTerm(id);
    await this.userRepository.softRemove(user);
    return { ...user, id };
  }
}
