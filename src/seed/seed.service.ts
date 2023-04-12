import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './../clients/entities/client.entity';
import { Project } from './../projects/entities/project.entity';
import { User } from './../users/entities/user.entity';
import { UsersService } from './../users/users.service';
import { USERS_TO_CREATE } from './data/users';

@Injectable()
export class SeedService {
  private isProd: boolean;

  constructor(
    //* Services
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    //? Repositories
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectService: Repository<Project>,
    @InjectRepository(Client)
    private readonly clientService: Repository<Client>,
  ) {
    this.isProd = this.configService.get('state') === 'prod';
  }

  async execute(): Promise<string> {
    if (this.isProd) throw new UnauthorizedException('Cannot run SEED on production');

    await this.cleanDB(); //! Delete all data in db

    await this.loadUsers(); //* Create users

    return 'SEED executed';
  }

  async cleanDB() {
    await this.projectService.delete({}); //! Delete all projects
    await this.clientService.delete({}); //! Delete all clients
    await this.userRepository.delete({}); //! Delete all users
  }

  async loadUsers() {
    const users = USERS_TO_CREATE.map((user) => this.userService.create(user));
    await Promise.all(users);
  }
}
