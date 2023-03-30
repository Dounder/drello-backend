import { ParseUUIDPipe } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth, GetUser } from 'src/auth/decorators';
import { PaginationArgs, SearchArgs } from 'src/common/dto';
import { UserRoles } from 'src/common/types/user-roles';
import { User } from 'src/users/entities/user.entity';

import { ClientsService } from './clients.service';
import { CreateClientInput } from './dto/create-client.input';
import { UpdateClientInput } from './dto/update-client.input';
import { Client } from './entities/client.entity';

@Resolver(() => Client)
@Auth()
export class ClientsResolver {
  constructor(private readonly clientsService: ClientsService) {}

  @Mutation(() => Client)
  createClient(
    @Args('createClientInput') createClientInput: CreateClientInput,
    @GetUser() user: User,
  ): Promise<Client> {
    return this.clientsService.create(createClientInput, user);
  }

  @Query(() => [Client], { name: 'clients' })
  findAll(@Args() paginationArgs: PaginationArgs, @Args() searchArgs: SearchArgs): Promise<Client[]> {
    return this.clientsService.findAll(paginationArgs, searchArgs);
  }

  @Query(() => Client, { name: 'client' })
  findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string): Promise<Client> {
    return this.clientsService.findOne(id);
  }

  @Mutation(() => Client)
  updateClient(@Args('updateClientInput') updateClientInput: UpdateClientInput): Promise<Client> {
    return this.clientsService.update(updateClientInput.id, updateClientInput);
  }

  @Mutation(() => Client)
  @Auth(UserRoles.admin)
  removeClient(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string): Promise<Client> {
    return this.clientsService.remove(id);
  }

  // TODO: implement custom resolver
}
