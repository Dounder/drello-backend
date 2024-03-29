import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { isUUID } from 'class-validator';
import { ArrayOverlap, In, IsNull, Not, Repository } from 'typeorm';

import { ErrorCodes } from './../common/helpers/errors-codes.helper';
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
      await this.CheckEmailExists(createUserInput.email);

      const user = this.userRepository.create({
        ...createUserInput,
        password: bcrypt.hashSync(createUserInput.password, 10),
      });
      return await this.userRepository.save(user);
    } catch (error) {
      HandleExceptions(error);
    }
  }

  async findAll(roles: UserRoles[], paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<User[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const query = this.userRepository.createQueryBuilder().take(limit).skip(offset);

    if (search) query.andWhere(`username ilike :text`, { text: `%${search}%` });

    if (roles.length === 0) return query.getMany();

    return query.andWhere({ roles: ArrayOverlap(roles) }).getMany();
  }

  async findByIds(ids: string[]): Promise<User[]> {
    if (ids.length === 0) return [];

    return await this.userRepository.findBy({ id: In(ids) });
  }

  async findOneByTerm(term: string): Promise<User> {
    const user = isUUID(term)
      ? await this.userRepository.findOne({ where: { id: term }, withDeleted: true })
      : await this.userRepository.findOne({ where: [{ username: term }, { email: term }], withDeleted: true });

    if (!user)
      throw new NotFoundException({
        message: `User with ${term} not found`,
        error: ErrorCodes.NOT_FOUND,
      });

    return user;
  }

  async update(id: string, updateUserInput: UpdateUserInput, adminUser?: User): Promise<User> {
    try {
      const user = await this.findOneByTerm(id);

      if (updateUserInput.password) updateUserInput.password = bcrypt.hashSync(updateUserInput.password, 10);

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

  private async CheckEmailExists(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email, deletedAt: Not(IsNull()) }, withDeleted: true });

    if (user)
      throw new BadRequestException({
        message: `User with email ${email} already exists but is inactive, please contact the administrator`,
        error: ErrorCodes.BAD_REQUEST,
      });
  }
}
