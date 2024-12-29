import { Test, TestingModule } from '@nestjs/testing';
import { UserStoriesService } from './userStories.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserStory } from './entities/userStory.entity';
import { BadRequestException } from '@nestjs/common';

describe('UserStoriesService', () => {
  let service: UserStoriesService;

  const mockUserStoriesRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserStoriesService,
        {
          provide: getRepositoryToken(UserStory),
          useValue: mockUserStoriesRepository,
        },
      ],
    }).compile();

    service = module.get<UserStoriesService>(UserStoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getFeatureUserStories => should find user stories corresponding to a feature id', async () => {
    const id = 1;
    const userStories = [
      {
        id: 1,
        name: 'US1',
        description: '',
        tasks: [],
        feature: {
          id: 1,
        },
      },
      {
        id: 12,
        name: 'US12',
        description: '',
        tasks: [],
        feature: {
          id: 1,
        },
      },
      {
        id: 2,
        name: 'US2',
        description: '',
        tasks: [],
        feature: {
          id: 1,
        },
      },
    ] as UserStory[];

    jest.spyOn(mockUserStoriesRepository, 'find').mockReturnValue(userStories);

    const result = await service.getFeatureUserStories(id);

    expect(result).toEqual(userStories);
    expect(mockUserStoriesRepository.find).toHaveBeenCalled();
    expect(mockUserStoriesRepository.find).toHaveBeenCalledWith({
      where: { feature: { id } },
      relations: ['tasks'],
    });
  });

  it('createUserStory => save the user story that is passed in and return the user stories associated with feature id that is passed in', async () => {
    const name = 'US21';
    const description = 'US21 Desc';
    const featureId = 1;
    const savedUserStories = {
      id: 3,
      name: 'US21',
      description: 'US21 Desc',
      tasks: [],
      feature: {
        id: 1,
      },
    } as UserStory;
    const userStories = [
      {
        id: 1,
        name: 'US1',
        description: '',
        tasks: [],
        feature: {
          id: 1,
        },
      },
      {
        id: 12,
        name: 'US12',
        description: '',
        tasks: [],
        feature: {
          id: 1,
        },
      },
      {
        id: 2,
        name: 'US2',
        description: '',
        tasks: [],
        feature: {
          id: 1,
        },
      },
      {
        id: 3,
        name: 'US21',
        description: 'US21 Desc',
        tasks: [],
        feature: {
          id: 1,
        },
      },
    ] as UserStory[];

    jest
      .spyOn(mockUserStoriesRepository, 'save')
      .mockReturnValue(savedUserStories);
    jest.spyOn(mockUserStoriesRepository, 'find').mockReturnValue(userStories);

    const result = await service.createUserStory(name, description, featureId);

    expect(result).toEqual(userStories);
    expect(mockUserStoriesRepository.save).toHaveBeenCalled();
    expect(mockUserStoriesRepository.save).toHaveBeenCalledWith({
      name,
      description,
      feature: {
        id: featureId,
      },
    });
    expect(mockUserStoriesRepository.find).toHaveBeenCalled();
    expect(mockUserStoriesRepository.find).toHaveBeenCalledWith({
      where: { feature: { id: featureId } },
      relations: ['tasks'],
    });
  });

  it('getUserStoryById => should return user story from an inputted user story id', async () => {
    const id = 1;

    const userStory = {
      id: 1,
      name: 'US1',
      description: 'US1 Desc',
      tasks: [],
      feature: {
        id: 1,
      },
    } as UserStory;

    jest.spyOn(mockUserStoriesRepository, 'findOne').mockReturnValue(userStory);

    const result = await service.getUserStoryById(id);

    expect(result).toEqual(userStory);
    expect(mockUserStoriesRepository.findOne).toHaveBeenCalled();
    expect(mockUserStoriesRepository.findOne).toHaveBeenCalledWith({
      where: { id },
      order: {
        tasks: { id: 'ASC' },
      },
      relations: ['tasks'],
    });
  });

  it('getUserStoryStatusById => should return the number of completed tasks out of the total number of task of a given user story id', async () => {
    const id = 1;

    const userStory = {
      id: 1,
      name: 'US1',
      description: 'US1 Desc',
      tasks: [
        { id: 1, status: 'To Do', name: 'Task 1' },
        { id: 2, status: 'In Progress', name: 'Task 2' },
        { id: 3, status: 'Done!', name: 'Task 3' },
        { id: 4, status: 'Done!', name: 'Task 4' },
        { id: 5, status: 'To Do', name: 'Task 5' },
      ],
      feature: {
        id: 1,
      },
    } as UserStory;

    jest.spyOn(mockUserStoriesRepository, 'findOne').mockReturnValue(userStory);

    const result = await service.getUserStoryStatusById(id);
    expect(result).toEqual('2/5');
    expect(mockUserStoriesRepository.findOne).toHaveBeenCalled();
    expect(mockUserStoriesRepository.findOne).toHaveBeenCalledWith({
      where: { id },
      order: {
        tasks: { id: 'ASC' },
      },
      relations: ['tasks'],
    });
  });

  it('updateUserStory => updates users story name and returns the associated project id', async () => {
    const field = 'name';
    const value = 'US11 - Edited';
    const userId = 15;
    const userStoryId = 11;

    const storyToUpdate = {
      id: 11,
      name: 'US11',
      description: '',
      tasks: [],
      feature: {
        id: 11,
        project: {
          id: 11,
        },
      },
    } as UserStory;

    const updatedStory = {
      id: 11,
      name: 'US11 - Edited',
      description: '',
      tasks: [],
      feature: {
        id: 11,
        project: {
          id: 11,
        },
      },
    } as UserStory;

    jest
      .spyOn(mockUserStoriesRepository, 'findOne')
      .mockReturnValue(storyToUpdate);
    jest.spyOn(mockUserStoriesRepository, 'save').mockReturnValue(updatedStory);

    const result = await service.updateUserStory(
      field,
      value,
      userId,
      userStoryId,
    );

    expect(result).toEqual(updatedStory.feature.project.id);
    expect(mockUserStoriesRepository.findOne).toHaveBeenCalled();
    expect(mockUserStoriesRepository.findOne).toHaveBeenCalledWith({
      where: {
        id: userStoryId,
        feature: { project: { user: { id: userId } } },
      },
      relations: ['feature', 'feature.project'],
    });
    expect(mockUserStoriesRepository.save).toHaveBeenCalled();
    expect(mockUserStoriesRepository.save).toHaveBeenCalledWith(updatedStory);
  });

  it('updateUserStory => updates users story description and returns the associated project id', async () => {
    const field = 'description';
    const value = 'US11 Description Added';
    const userId = 15;
    const userStoryId = 11;

    const storyToUpdate = {
      id: 11,
      name: 'US11',
      description: '',
      tasks: [],
      feature: {
        id: 11,
        project: {
          id: 11,
        },
      },
    } as UserStory;

    const updatedStory = {
      id: 11,
      name: 'US11',
      description: 'US11 Description Added',
      tasks: [],
      feature: {
        id: 11,
        project: {
          id: 11,
        },
      },
    } as UserStory;

    jest
      .spyOn(mockUserStoriesRepository, 'findOne')
      .mockReturnValue(storyToUpdate);
    jest.spyOn(mockUserStoriesRepository, 'save').mockReturnValue(updatedStory);

    const result = await service.updateUserStory(
      field,
      value,
      userId,
      userStoryId,
    );

    expect(result).toEqual(updatedStory.feature.project.id);
    expect(mockUserStoriesRepository.findOne).toHaveBeenCalled();
    expect(mockUserStoriesRepository.findOne).toHaveBeenCalledWith({
      where: {
        id: userStoryId,
        feature: { project: { user: { id: userId } } },
      },
      relations: ['feature', 'feature.project'],
    });
    expect(mockUserStoriesRepository.save).toHaveBeenCalled();
    expect(mockUserStoriesRepository.save).toHaveBeenCalledWith(updatedStory);
  });

  it('updateUserStory => throws an error when a user story is not found', async () => {
    const field = 'description';
    const value = 'US11 Description Added';
    const userId = 115;
    const userStoryId = 31;

    jest.spyOn(mockUserStoriesRepository, 'findOne').mockReturnValue(undefined);

    expect(async () => {
      await service.updateUserStory(field, value, userId, userStoryId);
    }).rejects.toThrow(BadRequestException);
    expect(mockUserStoriesRepository.findOne).toHaveBeenCalled();
    expect(mockUserStoriesRepository.findOne).toHaveBeenCalledWith({
      where: {
        id: userStoryId,
        feature: { project: { user: { id: userId } } },
      },
      relations: ['feature', 'feature.project'],
    });
  });

  it('deleteUserStory => deletes user story found by the passed in id and returns the associated project id', async () => {
    const userStoryId = 11;
    const userId = 15;

    const story = {
      id: 11,
      name: 'US11',
      description: '',
      tasks: [],
      feature: {
        id: 11,
        project: {
          id: 11,
        },
      },
    } as UserStory;

    const deletedResult = {
      raw: [],
      affected: 1,
    };

    jest.spyOn(mockUserStoriesRepository, 'findOne').mockReturnValue(story);
    jest.spyOn(mockUserStoriesRepository, 'delete').mockReturnValue(deletedResult);

    const result = await service.deleteUserStory(userStoryId, userId);

    expect(result).toEqual(story.feature.project.id);
    expect(mockUserStoriesRepository.findOne).toHaveBeenCalled();
    expect(mockUserStoriesRepository.findOne).toHaveBeenCalledWith({
      where: {
        id: userStoryId,
        feature: { project: { user: { id: userId } } },
      },
      relations: ['feature', 'feature.project'],
    });
    expect(mockUserStoriesRepository.delete).toHaveBeenCalled();
    expect(mockUserStoriesRepository.delete).toHaveBeenCalledWith(story);
  });

  it('deleteUserStory => throws error when user story is not found', async () => {
    const userStoryId = 111;
    const userId = 15;

    jest.spyOn(mockUserStoriesRepository, 'findOne').mockReturnValue(undefined);

    expect(async () => {
      await service.deleteUserStory(userStoryId, userId);
    }).rejects.toThrow(BadRequestException);
    expect(mockUserStoriesRepository.findOne).toHaveBeenCalled();
    expect(mockUserStoriesRepository.findOne).toHaveBeenCalledWith({
      where: {
        id: userStoryId,
        feature: { project: { user: { id: userId } } },
      },
      relations: ['feature', 'feature.project'],
    });
  });
});
