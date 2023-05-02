import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationArgs, SearchArgs } from 'src/common/dto';
import { HandleExceptions } from 'src/common/helpers/handle-exceptions.helper';
import { Repository } from 'typeorm';
import { ErrorCodes } from './../common/helpers/errors-codes.helper';
import { User } from './../users/entities/user.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(createProjectInput: CreateProjectInput, user: User): Promise<Project> {
    try {
      const project = this.projectRepository.create({
        ...createProjectInput,
        createdBy: user,
      });

      return await this.projectRepository.save(project);
    } catch (error) {
      HandleExceptions(error);
    }
  }

  async findAll(paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<Project[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const query = this.projectRepository.createQueryBuilder().take(limit).skip(offset);

    if (search) query.andWhere(`title ilike :text`, { text: `%${search}%` });

    return query.getMany();
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findOneBy({ id });
    if (!project)
      throw new NotFoundException({
        message: `Project with ${id} not found`,
        error: ErrorCodes.NOT_FOUND,
      });

    return project;
  }

  async update(id: string, updateProjectInput: UpdateProjectInput): Promise<Project> {
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
