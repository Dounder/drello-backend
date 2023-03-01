import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationArgs, SearchArgs } from 'src/common/dto';
import { HandleExceptions } from 'src/common/helpers/handle-exceptions.helper';
import { Repository } from 'typeorm';
import { User } from './../users/entities/user.entity';

import { CreateClientInput } from './dto/create-client.input';
import { UpdateClientInput } from './dto/update-client.input';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(
    createClientInput: CreateClientInput,
    user: User,
  ): Promise<Client> {
    const client = this.clientRepository.create({
      ...createClientInput,
      createdBy: user,
    });
    return await this.clientRepository.save(client);
  }

  async findAll(
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<Client[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const query = this.clientRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset)
      .withDeleted();

    if (search) query.andWhere(`name ilike :text`, { text: `%${search}%` });

    return query.getMany();
  }

  async findOne(id: string): Promise<Client> {
    try {
      return this.clientRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException(`Client with ${id} not found`);
    }
  }

  async update(
    id: string,
    updateClientInput: UpdateClientInput,
  ): Promise<Client> {
    try {
      const client = await this.findOne(id);
      return await this.clientRepository.save({
        ...client,
        ...updateClientInput,
      });
    } catch (error) {
      HandleExceptions(error);
    }
  }

  async remove(id: string): Promise<Client> {
    const client = await this.findOne(id);
    await this.clientRepository.softRemove(client);
    return { id, ...client };
  }
}
