import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async getUserStoryTasks(id: number) {
    return await this.tasksRepository.find({
      where: { userStory: { id } },
    });
  }

  async createTask(name: string, userStoryId: number) {
    await this.tasksRepository.save({
      name,
      userStory: {
        id: userStoryId,
      },
    });
    return await this.getUserStoryTasks(userStoryId);
  }
  async updateTask(
    field: string,
    value: string,
    userId: number,
    taskId: number,
  ) {
    const taskToUpdate = await this.tasksRepository.findOne({
      where: {
        id: taskId,
        userStory: { feature: { project: { user: { id: userId } } } },
      },
      relations: ['userStory'],
    });
    if (taskToUpdate) {
      taskToUpdate[field] = value;
     const updatedTask = await this.tasksRepository.save(taskToUpdate);
      return updatedTask.userStory.id;
    } else {
      throw new BadRequestException('You cannot edit that task');
    }
  }
}
