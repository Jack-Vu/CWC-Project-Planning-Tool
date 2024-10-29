import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserStoriesService } from './userStories.service';
import { UserStory } from './entities/userStory.entity';

@Module({
  providers: [UserStoriesService],
  exports: [UserStoriesService],
  imports: [TypeOrmModule.forFeature([UserStory])],
})
export class UserStoriesModule {}
