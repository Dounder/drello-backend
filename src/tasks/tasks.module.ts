import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubRequestsModule } from './../sub-requests/sub-requests.module';
import { Task } from './entities/task.entity';
import { TasksResolver } from './tasks.resolver';
import { TasksService } from './tasks.service';

@Module({
  providers: [TasksResolver, TasksService],
  imports: [TypeOrmModule.forFeature([Task]), SubRequestsModule],
  exports: [TypeOrmModule, TasksService],
})
export class TasksModule {}
