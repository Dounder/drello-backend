import { ParseUUIDPipe } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth, GetUser } from 'src/auth/decorators';
import { PaginationArgs, SearchArgs } from 'src/common/dto';
import { User } from './../users/entities/user.entity';
import { CreateSubRequestInput } from './dto/create-sub-request.input';
import { UpdateSubRequestInput } from './dto/update-sub-request.input';
import { SubRequest } from './entities/sub-request.entity';
import { SubRequestsService } from './sub-requests.service';

@Resolver(() => SubRequest)
@Auth()
export class SubRequestsResolver {
  constructor(private readonly subRequestsService: SubRequestsService) {}

  @Mutation(() => SubRequest)
  createSubRequest(
    @Args('createSubRequestInput') createSubRequestInput: CreateSubRequestInput,
    @GetUser() user: User,
  ) {
    return this.subRequestsService.create(createSubRequestInput, user);
  }

  @Query(() => [SubRequest], { name: 'subRequests' })
  findAll(paginationArgs: PaginationArgs, searchArgs: SearchArgs) {
    return this.subRequestsService.findAll(paginationArgs, searchArgs);
  }

  @Query(() => SubRequest, { name: 'subRequest' })
  findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.subRequestsService.findOne(id);
  }

  @Mutation(() => SubRequest)
  updateSubRequest(
    @Args('updateSubRequestInput') updateSubRequestInput: UpdateSubRequestInput,
  ) {
    return this.subRequestsService.update(
      updateSubRequestInput.id,
      updateSubRequestInput,
    );
  }

  @Mutation(() => SubRequest)
  removeSubRequest(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.subRequestsService.remove(id);
  }

  // TODO: implements custom resolver
}
