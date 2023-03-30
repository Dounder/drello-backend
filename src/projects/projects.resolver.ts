import { ParseUUIDPipe } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth, GetUser } from 'src/auth/decorators';
import { PaginationArgs, SearchArgs } from 'src/common/dto';
import { UserRoles } from './../common/types/user-roles';
import { User } from './../users/entities/user.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { Project } from './entities/project.entity';
import { ProjectsService } from './projects.service';

@Resolver(() => Project)
@Auth()
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Mutation(() => Project)
  createProject(@Args('createProjectInput') createProjectInput: CreateProjectInput, @GetUser() user: User) {
    return this.projectsService.create(createProjectInput, user);
  }

  @Query(() => [Project], { name: 'projects' })
  findAll(@Args() paginationArgs: PaginationArgs, @Args() searchArgs: SearchArgs): Promise<Project[]> {
    return this.projectsService.findAll(paginationArgs, searchArgs);
  }

  @Query(() => Project, { name: 'project' })
  findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.projectsService.findOne(id);
  }

  @Mutation(() => Project)
  updateProject(@Args('updateProjectInput') updateProjectInput: UpdateProjectInput) {
    return this.projectsService.update(updateProjectInput.id, updateProjectInput);
  }

  @Mutation(() => Project)
  @Auth(UserRoles.admin)
  removeProject(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.projectsService.remove(id);
  }

  // TODO: implement custom resolver
}
