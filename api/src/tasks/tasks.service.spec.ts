import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';

describe('TasksService', () => {
  let service: TasksService;

  const mockTaskRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getUserStoryTasks => should find tasks corresponding to a user story id', async () => {
    const id = 1;
    const tasks = [
      { id: 1, name: 'Task 1', status: 'To Do' },
      { id: 2, name: 'Task 2', status: 'To Do' },
      { id: 3, name: 'Task 3', status: 'Done!' },
    ] as Task[];

    jest.spyOn(mockTaskRepository, 'find').mockReturnValue(tasks);

    const result = await service.getUserStoryTasks(id);

    expect(result).toEqual(tasks);
    expect(mockTaskRepository.find).toHaveBeenCalled();
    expect(mockTaskRepository.find).toHaveBeenCalledWith({
      where: { userStory: { id } },
    });
  });

  it('createTask => should return the task associated with the user story id that is passed in addition to an extra task with name that was passed in', async () => {
    const name = 'Task 4';
    const userStoryId = 1;
    const savedTasks = {
      id: 4,
      name: 'Task 4',
      status: 'Done!',
      userStory: {
        id: 1,
      },
    } as Task;
    const tasks = [
      {
        id: 1,
        name: 'Task 1',
        status: 'To Do',
        userStory: {
          id: 1,
        },
      },
      {
        id: 2,
        name: 'Task 2',
        status: 'To Do',
        userStory: {
          id: 1,
        },
      },
      {
        id: 3,
        name: 'Task 3',
        status: 'Done!',
        userStory: {
          id: 1,
        },
      },
      {
        id: 4,
        name: 'Task 4',
        status: 'Done!',
        userStory: {
          id: 1,
        },
      },
    ] as Task[];

    jest.spyOn(mockTaskRepository, 'save').mockReturnValue(savedTasks);
    jest.spyOn(mockTaskRepository, 'find').mockReturnValue(tasks);

    const result = await service.createTask(name, userStoryId);

    expect(result).toEqual(tasks);
    expect(mockTaskRepository.save).toHaveBeenCalled();
    expect(mockTaskRepository.save).toHaveBeenCalledWith({
      name,
      userStory: {
        id: userStoryId,
      },
    });
    expect(mockTaskRepository.find).toHaveBeenCalled();
    expect(mockTaskRepository.find).toHaveBeenCalledWith({
      where: { userStory: { id: userStoryId } },
    });
  });
});
