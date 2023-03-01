import { ClientsService } from './../clients/clients.service';
import { HandleExceptions } from 'src/common/helpers/handle-exceptions.helper';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async findAll(): Promise<Project[]> {
    return await this.projectRepository.findBy({});
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
