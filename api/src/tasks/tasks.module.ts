import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';

@Module({
  providers: [TasksService],
  exports: [TasksService],
  imports: [TypeOrmModule.forFeature([Task])],
})
export class TasksModule {}
