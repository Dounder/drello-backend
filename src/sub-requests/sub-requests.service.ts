import { ErrorCodes } from './../common/helpers/errors-codes.helper';
import { HandleExceptions } from 'src/common/helpers/handle-exceptions.helper';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationArgs, SearchArgs } from './../common/dto';
import { RequestsService } from './../requests/requests.service';
import { User } from './../users/entities/user.entity';
import { CreateSubRequestInput } from './dto/create-sub-request.input';
import { UpdateSubRequestInput } from './dto/update-sub-request.input';
import { SubRequest } from './entities/sub-request.entity';

@Injectable()
export class SubRequestsService {
  constructor(
    @InjectRepository(SubRequest)
    private readonly subRequestRepository: Repository<SubRequest>,

    private readonly requesetService: RequestsService,
  ) {}

  async create(createSubRequestInput: CreateSubRequestInput, user: User): Promise<SubRequest> {
    const request = await this.requesetService.findOne(createSubRequestInput.requestId);
    const subRequest = this.subRequestRepository.create({
      ...createSubRequestInput,
      request,
      createdBy: user,
    });
    return await this.subRequestRepository.save(subRequest);
  }

  async findAll(paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<SubRequest[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const query = this.subRequestRepository.createQueryBuilder().skip(offset).take(limit);

    if (search) query.andWhere(`title ilike :text`, { text: `%${search}%` });

    return query.getMany();
  }

  async findOne(id: string): Promise<SubRequest> {
    const subRequest = await this.subRequestRepository.findOneBy({ id });

    if (!subRequest)
      throw new NotFoundException({
        message: `SubRequest with ${id} not found`,
        error: ErrorCodes.NOT_FOUND,
      });

    return subRequest;
  }

  async update(id: string, updateSubRequestInput: UpdateSubRequestInput): Promise<SubRequest> {
    try {
      const subRequest = await this.findOne(id);
      return this.subRequestRepository.save({
        ...subRequest,
        ...updateSubRequestInput,
      });
    } catch (error) {
      HandleExceptions(error);
    }
  }

  async remove(id: string): Promise<SubRequest> {
    const subRequest = await this.findOne(id);
    await this.subRequestRepository.softRemove(subRequest);
    return { id, ...subRequest };
  }
}
