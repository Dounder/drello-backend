import { ParseUUIDPipe } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth, GetUser } from 'src/auth/decorators';
import { PaginationArgs, SearchArgs } from 'src/common/dto';
import { UserRoles } from 'src/common/types/user-roles';
import { User } from './../users/entities/user.entity';
import { CreateRequestInput } from './dto/create-request.input';
import { UpdateRequestInput } from './dto/update-request.input';
import { Request } from './entities/request.entity';
import { RequestsService } from './requests.service';

@Resolver(() => Request)
@Auth()
export class RequestsResolver {
  constructor(private readonly requestsService: RequestsService) {}

  @Mutation(() => Request)
  createRequest(@Args('createRequestInput') createRequestInput: CreateRequestInput, @GetUser() user: User) {
    return this.requestsService.create(createRequestInput, user);
  }

  @Query(() => [Request], { name: 'requests' })
  findAll(@Args() paginationArgs: PaginationArgs, @Args() searchArgs: SearchArgs) {
    return this.requestsService.findAll(paginationArgs, searchArgs);
  }

  @Query(() => Request, { name: 'request' })
  findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.requestsService.findOne(id);
  }

  @Mutation(() => Request)
  updateRequest(@Args('updateRequestInput') updateRequestInput: UpdateRequestInput) {
    return this.requestsService.update(updateRequestInput.id, updateRequestInput);
  }

  @Mutation(() => Request)
  @Auth(UserRoles.admin)
  removeRequest(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.requestsService.remove(id);
  }

  // TODO: implement custom resolver
}
