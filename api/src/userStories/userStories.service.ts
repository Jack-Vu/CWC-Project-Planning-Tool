import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserStory } from './entities/userStory.entity';

@Injectable()
export class UserStoriesService {
  constructor(
    @InjectRepository(UserStory)
    private userStoriesRepository: Repository<UserStory>,
  ) {}

  async getFeatureUserStories(id: number) {
    return await this.userStoriesRepository.find({
      where: { feature: { id } },
      relations: ['tasks'],
    });
  }

  async createUserStory(name: string, description: string, featureId: number) {
    await this.userStoriesRepository.save({
      name,
      description,
      feature: {
        id: featureId,
      },
    });
    return await this.getFeatureUserStories(featureId);
  }

  async getUserStoryById(id: number) {
    return await this.userStoriesRepository.findOne({
      where: { id },
      order: {
        tasks: { id: 'ASC' },
      },
      relations: ['tasks'],
    });
  }

  async getUserStoryStatusById(id: number) {
    const userStory = await this.getUserStoryById(id);

    const tasks = userStory.tasks;
    const taskCount = tasks.length;
    const completedTasks = tasks.filter((task) => task.status === 'Done!');
    const completedTasksLength = completedTasks.length;
    return `${completedTasksLength}/${taskCount}`;
  }

  async updateUserStory(
    field: string,
    value: string,
    userId: number,
    userStoryId: number,
  ) {
    const storyToUpdate = await this.userStoriesRepository.findOne({
      where: {
        id: userStoryId,
        feature: { project: { user: { id: userId } } },
      },
      relations: ['feature', 'feature.project'],
    });

    if (storyToUpdate) {
      storyToUpdate[field] = value;
      const updatedStory = await this.userStoriesRepository.save(storyToUpdate);

      return updatedStory.feature.project.id;
    } else {
      throw new BadRequestException('You cannot edit that user story');
    }
  }

  async deleteUserStory(userStoryId: number, userId: number) {
    const storyToDelete = await this.userStoriesRepository.findOne({
      where: {
        id: userStoryId,
        feature: { project: { user: { id: userId } } },
      },
      relations: ['feature', 'feature.project'],
    });

    if (storyToDelete) {
      await this.userStoriesRepository.delete(storyToDelete);
      return storyToDelete.feature.project.id;
    } else {
      throw new BadRequestException('You cannot delete that user story');
    }
    console.log('Story to delete', storyToDelete);
  }
}
