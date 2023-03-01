import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationArgs, SearchArgs } from 'src/common/dto';
import { HandleExceptions } from 'src/common/helpers/handle-exceptions.helper';
import { Repository } from 'typeorm';
import { ClientsService } from './../clients/clients.service';
import { User } from './../users/entities/user.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    private readonly clientService: ClientsService,
  ) {}

  async create(
    createProjectInput: CreateProjectInput,
    user: User,
  ): Promise<Project> {
    try {
      const client = await this.clientService.findOne(
        createProjectInput.clientId,
      );
      const project = this.projectRepository.create({
        ...createProjectInput,
        client,
        createdBy: user,
      });
      return await this.projectRepository.save(project);
    } catch (error) {
      HandleExceptions(error);
    }
  }

  async findAll(
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<Project[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const query = this.projectRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset)
      .withDeleted();

    if (search) query.andWhere(`title ilike :text`, { text: `%${search}%` });

    return query.getMany();
  }

  async findOne(id: string): Promise<Project> {
    try {
      return await this.projectRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException(`Project with ${id} not found`);
    }
  }

  async update(
    id: string,
    updateProjectInput: UpdateProjectInput,
  ): Promise<Project> {
    try {
      const project = await this.findOne(id);
      return await this.projectRepository.save({
        ...project,
        ...updateProjectInput,
      });
    } catch (error) {
      HandleExceptions(error);
    }
  }

  async remove(id: string): Promise<Project> {
    const project = await this.findOne(id);
    await this.projectRepository.softRemove(project);
    return { id, ...project };
  }
}
