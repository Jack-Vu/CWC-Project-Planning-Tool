import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { BadRequestException } from '@nestjs/common';

describe('ProjectsService', () => {
  let service: ProjectsService;

  const mockProjectsRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useValue: mockProjectsRepository,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addStatusesToProject => should add statuses to projects, features, and user stories', () => {
    const project = {
      id: 1,
      name: 'P1',
      description: 'P1 Desc',
      features: [
        {
          id: 1,
          name: 'F1',
          description: 'F1 Desc',
          userStories: [
            {
              id: 1,
              name: 'US1',
              description: 'US1 Desc',
              tasks: [
                { id: 1, name: 'T1', status: 'To Do' },
                { id: 2, name: 'T2', status: 'In Progress' },
              ],
            },
            {
              id: 2,
              name: 'US2',
              description: 'US2 Desc',
              tasks: [
                { id: 3, name: 'T3', status: 'Done!' },
                { id: 4, name: 'T4', status: 'To Do' },
              ],
            },
          ],
        },
        {
          id: 2,
          name: 'F2',
          description: 'F2 Desc',
          userStories: [
            {
              id: 3,
              name: 'US3',
              description: 'US3 Desc',
              tasks: [
                { id: 5, name: 'T5', status: 'To Do' },
                { id: 6, name: 'T6', status: 'In Progress' },
              ],
            },
            {
              id: 4,
              name: 'US4',
              description: 'US4 Desc',
              tasks: [
                { id: 7, name: 'T7', status: 'Done!' },
                { id: 8, name: 'T8', status: 'Done!' },
              ],
            },
          ],
        },
      ],
    } as Project;
    const projectWithStatuses = {
      id: 1,
      name: 'P1',
      description: 'P1 Desc',
      status: 'In Progress',
      features: [
        {
          id: 1,
          name: 'F1',
          description: 'F1 Desc',
          userStoryCount: 2,
          completedUserStories: 0,
          status: 'In Progress',
          userStories: [
            {
              id: 1,
              name: 'US1',
              description: 'US1 Desc',
              tasksCount: 2,
              completedTasks: 0,
              tasks: [
                { id: 1, name: 'T1', status: 'To Do' },
                { id: 2, name: 'T2', status: 'In Progress' },
              ],
            },
            {
              id: 2,
              name: 'US2',
              description: 'US2 Desc',
              tasksCount: 2,
              completedTasks: 1,
              tasks: [
                { id: 3, name: 'T3', status: 'Done!' },
                { id: 4, name: 'T4', status: 'To Do' },
              ],
            },
          ],
        },
        {
          id: 2,
          name: 'F2',
          description: 'F2 Desc',
          userStoryCount: 2,
          completedUserStories: 1,
          status: 'In Progress',
          userStories: [
            {
              id: 3,
              name: 'US3',
              description: 'US3 Desc',
              tasksCount: 2,
              completedTasks: 0,
              tasks: [
                { id: 5, name: 'T5', status: 'To Do' },
                { id: 6, name: 'T6', status: 'In Progress' },
              ],
            },
            {
              id: 4,
              name: 'US4',
              description: 'US4 Desc',
              tasksCount: 2,
              completedTasks: 2,
              tasks: [
                { id: 7, name: 'T7', status: 'Done!' },
                { id: 8, name: 'T8', status: 'Done!' },
              ],
            },
          ],
        },
      ],
    };

    const result = service.addStatusesToProject(project);

    expect(result).toEqual(projectWithStatuses);
  });

  it('getUserProjects => returns a users projects based on their passed in id', async () => {
    const id = 15;
    const projects = [
      {
        id: 1,
        name: 'P1',
        description: 'P1 Desc',
        features: [
          {
            id: 1,
            name: 'F1',
            description: 'F1 Desc',
            userStories: [
              {
                id: 1,
                name: 'US1',
                description: 'US1 Desc',
                tasks: [
                  { id: 1, name: 'T1', status: 'To Do' },
                  { id: 2, name: 'T2', status: 'In Progress' },
                ],
              },
              {
                id: 2,
                name: 'US2',
                description: 'US2 Desc',
                tasks: [
                  { id: 3, name: 'T3', status: 'Done!' },
                  { id: 4, name: 'T4', status: 'To Do' },
                ],
              },
            ],
          },
          {
            id: 2,
            name: 'F2',
            description: 'F2 Desc',
            userStories: [
              {
                id: 3,
                name: 'US3',
                description: 'US3 Desc',
                tasks: [
                  { id: 5, name: 'T5', status: 'To Do' },
                  { id: 6, name: 'T6', status: 'In Progress' },
                ],
              },
              {
                id: 4,
                name: 'US4',
                description: 'US4 Desc',
                tasks: [
                  { id: 7, name: 'T7', status: 'Done!' },
                  { id: 8, name: 'T8', status: 'Done!' },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 2,
        name: 'P2',
        description: 'P2 Desc',
        features: [
          {
            id: 1,
            name: 'F1',
            description: 'F1 Desc',
            userStories: [
              {
                id: 1,
                name: 'US1',
                description: 'US1 Desc',
                tasks: [{ id: 1, name: 'T1', status: 'To Do' }],
              },
            ],
          },
        ],
      },
    ] as Project[];

    const projectsWithStatues = [
      {
        id: 1,
        name: 'P1',
        description: 'P1 Desc',
        status: 'In Progress',
        features: [
          {
            id: 1,
            name: 'F1',
            description: 'F1 Desc',
            userStoryCount: 2,
            completedUserStories: 0,
            status: 'In Progress',
            userStories: [
              {
                id: 1,
                name: 'US1',
                description: 'US1 Desc',
                tasksCount: 2,
                completedTasks: 0,
                tasks: [
                  { id: 1, name: 'T1', status: 'To Do' },
                  { id: 2, name: 'T2', status: 'In Progress' },
                ],
              },
              {
                id: 2,
                name: 'US2',
                description: 'US2 Desc',
                tasksCount: 2,
                completedTasks: 1,
                tasks: [
                  { id: 3, name: 'T3', status: 'Done!' },
                  { id: 4, name: 'T4', status: 'To Do' },
                ],
              },
            ],
          },
          {
            id: 2,
            name: 'F2',
            description: 'F2 Desc',
            userStoryCount: 2,
            completedUserStories: 1,
            status: 'In Progress',
            userStories: [
              {
                id: 3,
                name: 'US3',
                description: 'US3 Desc',
                tasksCount: 2,
                completedTasks: 0,
                tasks: [
                  { id: 5, name: 'T5', status: 'To Do' },
                  { id: 6, name: 'T6', status: 'In Progress' },
                ],
              },
              {
                id: 4,
                name: 'US4',
                description: 'US4 Desc',
                tasksCount: 2,
                completedTasks: 2,
                tasks: [
                  { id: 7, name: 'T7', status: 'Done!' },
                  { id: 8, name: 'T8', status: 'Done!' },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 2,
        name: 'P2',
        description: 'P2 Desc',
        status: 'To Do',
        features: [
          {
            id: 1,
            name: 'F1',
            description: 'F1 Desc',
            completedUserStories: 0,
            userStoryCount: 1,
            status: 'To Do',
            userStories: [
              {
                id: 1,
                name: 'US1',
                description: 'US1 Desc',
                tasksCount: 1,
                completedTasks: 0,
                tasks: [{ id: 1, name: 'T1', status: 'To Do' }],
              },
            ],
          },
        ],
      },
      ,
    ];

    jest.spyOn(mockProjectsRepository, 'find').mockReturnValue(projects);

    const results = await service.getUserProjects(id);
    expect(results).toEqual(projectsWithStatues);
    expect(mockProjectsRepository.find).toHaveBeenCalled();
    expect(mockProjectsRepository.find).toHaveBeenCalledWith({
      where: { user: { id } },
      order: {
        features: {
          id: 'ASC',
          userStories: {
            id: 'ASC',
            tasks: {
              id: 'ASC',
            },
          },
        },
      },
      relations: [
        'features',
        'features.userStories',
        'features.userStories.tasks',
      ],
    });
  });

  it('getProjectId => return a project with statuses from inputted project id', async () => {
    const id = 1;
    const project = {
      id: 1,
      name: 'P1',
      description: 'P1 Desc',
      features: [
        {
          id: 1,
          name: 'F1',
          description: 'F1 Desc',
          userStories: [
            {
              id: 1,
              name: 'US1',
              description: 'US1 Desc',
              tasks: [
                { id: 1, name: 'T1', status: 'To Do' },
                { id: 2, name: 'T2', status: 'In Progress' },
              ],
            },
            {
              id: 2,
              name: 'US2',
              description: 'US2 Desc',
              tasks: [
                { id: 3, name: 'T3', status: 'Done!' },
                { id: 4, name: 'T4', status: 'To Do' },
              ],
            },
          ],
        },
        {
          id: 2,
          name: 'F2',
          description: 'F2 Desc',
          userStories: [
            {
              id: 3,
              name: 'US3',
              description: 'US3 Desc',
              tasks: [
                { id: 5, name: 'T5', status: 'To Do' },
                { id: 6, name: 'T6', status: 'In Progress' },
              ],
            },
            {
              id: 4,
              name: 'US4',
              description: 'US4 Desc',
              tasks: [
                { id: 7, name: 'T7', status: 'Done!' },
                { id: 8, name: 'T8', status: 'Done!' },
              ],
            },
          ],
        },
      ],
    } as Project;
    const projectWithStatuses = {
      id: 1,
      name: 'P1',
      description: 'P1 Desc',
      status: 'In Progress',
      features: [
        {
          id: 1,
          name: 'F1',
          description: 'F1 Desc',
          userStoryCount: 2,
          completedUserStories: 0,
          status: 'In Progress',
          userStories: [
            {
              id: 1,
              name: 'US1',
              description: 'US1 Desc',
              tasksCount: 2,
              completedTasks: 0,
              tasks: [
                { id: 1, name: 'T1', status: 'To Do' },
                { id: 2, name: 'T2', status: 'In Progress' },
              ],
            },
            {
              id: 2,
              name: 'US2',
              description: 'US2 Desc',
              tasksCount: 2,
              completedTasks: 1,
              tasks: [
                { id: 3, name: 'T3', status: 'Done!' },
                { id: 4, name: 'T4', status: 'To Do' },
              ],
            },
          ],
        },
        {
          id: 2,
          name: 'F2',
          description: 'F2 Desc',
          userStoryCount: 2,
          completedUserStories: 1,
          status: 'In Progress',
          userStories: [
            {
              id: 3,
              name: 'US3',
              description: 'US3 Desc',
              tasksCount: 2,
              completedTasks: 0,
              tasks: [
                { id: 5, name: 'T5', status: 'To Do' },
                { id: 6, name: 'T6', status: 'In Progress' },
              ],
            },
            {
              id: 4,
              name: 'US4',
              description: 'US4 Desc',
              tasksCount: 2,
              completedTasks: 2,
              tasks: [
                { id: 7, name: 'T7', status: 'Done!' },
                { id: 8, name: 'T8', status: 'Done!' },
              ],
            },
          ],
        },
      ],
    };

    jest.spyOn(mockProjectsRepository, 'findOne').mockReturnValue(project);

    const result = await service.getProjectById(id);

    expect(result).toEqual(projectWithStatuses);
    expect(mockProjectsRepository.findOne).toHaveBeenCalled();
    expect(mockProjectsRepository.findOne).toHaveBeenCalledWith({
      where: { id },
      order: {
        features: {
          id: 'ASC',
          userStories: {
            id: 'ASC',
            tasks: {
              id: 'ASC',
            },
          },
        },
      },
      relations: [
        'features',
        'features.userStories',
        'features.userStories.tasks',
      ],
    });
  });

  it('createProject => add new project and return all user projects based on user id', async () => {
    const name = 'P2';
    const description = 'P2 description';
    const userId = 2;

    const savedProject = {
      id: 2,
      name: 'P2',
      description: 'P2 description',
      features: [],
    } as Project;

    const savedProjects = [
      {
        id: 1,
        name: 'P1',
        description: 'P1 Desc',
        features: [
          {
            id: 1,
            name: 'F1',
            description: 'F1 Desc',
            userStories: [
              {
                id: 1,
                name: 'US1',
                description: 'US1 Desc',
                tasks: [
                  { id: 1, name: 'T1', status: 'To Do' },
                  { id: 2, name: 'T2', status: 'In Progress' },
                ],
              },
              {
                id: 2,
                name: 'US2',
                description: 'US2 Desc',
                tasks: [
                  { id: 3, name: 'T3', status: 'Done!' },
                  { id: 4, name: 'T4', status: 'To Do' },
                ],
              },
            ],
          },
          {
            id: 2,
            name: 'F2',
            description: 'F2 Desc',
            userStories: [
              {
                id: 3,
                name: 'US3',
                description: 'US3 Desc',
                tasks: [
                  { id: 5, name: 'T5', status: 'To Do' },
                  { id: 6, name: 'T6', status: 'In Progress' },
                ],
              },
              {
                id: 4,
                name: 'US4',
                description: 'US4 Desc',
                tasks: [
                  { id: 7, name: 'T7', status: 'Done!' },
                  { id: 8, name: 'T8', status: 'Done!' },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 2,
        name: 'P2',
        description: 'P2 description',
        features: [],
      },
    ] as Project[];

    const projectsWithStatues = [
      {
        id: 1,
        name: 'P1',
        description: 'P1 Desc',
        status: 'In Progress',
        features: [
          {
            id: 1,
            name: 'F1',
            description: 'F1 Desc',
            userStoryCount: 2,
            completedUserStories: 0,
            status: 'In Progress',
            userStories: [
              {
                id: 1,
                name: 'US1',
                description: 'US1 Desc',
                tasksCount: 2,
                completedTasks: 0,
                tasks: [
                  { id: 1, name: 'T1', status: 'To Do' },
                  { id: 2, name: 'T2', status: 'In Progress' },
                ],
              },
              {
                id: 2,
                name: 'US2',
                description: 'US2 Desc',
                tasksCount: 2,
                completedTasks: 1,
                tasks: [
                  { id: 3, name: 'T3', status: 'Done!' },
                  { id: 4, name: 'T4', status: 'To Do' },
                ],
              },
            ],
          },
          {
            id: 2,
            name: 'F2',
            description: 'F2 Desc',
            userStoryCount: 2,
            completedUserStories: 1,
            status: 'In Progress',
            userStories: [
              {
                id: 3,
                name: 'US3',
                description: 'US3 Desc',
                tasksCount: 2,
                completedTasks: 0,
                tasks: [
                  { id: 5, name: 'T5', status: 'To Do' },
                  { id: 6, name: 'T6', status: 'In Progress' },
                ],
              },
              {
                id: 4,
                name: 'US4',
                description: 'US4 Desc',
                tasksCount: 2,
                completedTasks: 2,
                tasks: [
                  { id: 7, name: 'T7', status: 'Done!' },
                  { id: 8, name: 'T8', status: 'Done!' },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 2,
        name: 'P2',
        description: 'P2 description',
        status: 'To Do',
        features: [],
      },
      ,
    ];

    jest.spyOn(mockProjectsRepository, 'save').mockReturnValue(savedProject);
    jest.spyOn(mockProjectsRepository, 'find').mockReturnValue(savedProjects);

    const result = await service.createProject(name, description, userId);

    expect(result).toEqual(projectsWithStatues);
    expect(mockProjectsRepository.save).toHaveBeenCalled();
    expect(mockProjectsRepository.save).toHaveBeenCalledWith({
      name,
      description,
      user: {
        id: userId,
      },
    });
    expect(mockProjectsRepository.find).toHaveBeenCalled();
    expect(mockProjectsRepository.find).toHaveBeenCalledWith({
      where: { user: { id: userId } },
      order: {
        features: {
          id: 'ASC',
          userStories: {
            id: 'ASC',
            tasks: {
              id: 'ASC',
            },
          },
        },
      },
      relations: [
        'features',
        'features.userStories',
        'features.userStories.tasks',
      ],
    });
  });

  it('updateProject => updates a project name and returns the project with statuses', async () => {
    const field = 'name';
    const value = 'P2 - Edited';
    const userId = 4;
    const projectId = 2;

    const projectToUpdate = {
      id: 2,
      name: 'P2',
      description: 'P2 description',
    } as Project;

    const updatedProject = {
      id: 2,
      name: 'P2 - Edited',
      description: 'P2 description',
    } as Project;

    const projectWithRelations = {
      id: 2,
      name: 'P2 - Edited',
      description: 'P2 description',
      status: 'To Do',
      features: [],
    };

    const projectWithRelationsAndStatus = {
      id: 2,
      name: 'P2 - Edited',
      description: 'P2 description',
      status: 'To Do',
      features: [],
    };

    jest
      .spyOn(mockProjectsRepository, 'findOne')
      .mockReturnValueOnce(projectToUpdate);
    jest.spyOn(mockProjectsRepository, 'save').mockReturnValue(updatedProject);
    jest
      .spyOn(mockProjectsRepository, 'findOne')
      .mockReturnValueOnce(projectWithRelations);

    const result = await service.updateProject(field, value, userId, projectId);

    expect(result).toEqual(projectWithRelationsAndStatus);
    expect(mockProjectsRepository.findOne).toHaveBeenCalled();
    expect(mockProjectsRepository.findOne).toHaveBeenCalledWith({
      where: { id: projectId, user: { id: userId } },
    });
    expect(mockProjectsRepository.findOne).toHaveBeenLastCalledWith({
      where: { id: projectId },
      order: {
        features: {
          id: 'ASC',
          userStories: {
            id: 'ASC',
            tasks: {
              id: 'ASC',
            },
          },
        },
      },
      relations: [
        'features',
        'features.userStories',
        'features.userStories.tasks',
      ],
    });
    expect(mockProjectsRepository.save).toHaveBeenCalled();
    expect(mockProjectsRepository.save).toHaveBeenCalledWith(projectToUpdate);
  });

  it('updateProject => updates a project description and returns the project with statuses', async () => {
    const field = 'description';
    const value = 'P2 description - Edited';
    const userId = 4;
    const projectId = 2;

    const projectToUpdate = {
      id: 2,
      name: 'P2',
      description: 'P2 description',
    } as Project;

    const updatedProject = {
      id: 2,
      name: 'P2 - Edited',
      description: 'P2 description - Edited',
    } as Project;

    const projectWithRelations = {
      id: 2,
      name: 'P2 - Edited',
      description: 'P2 description - Edited',
      status: 'To Do',
      features: [],
    };

    const projectWithRelationsAndStatus = {
      id: 2,
      name: 'P2 - Edited',
      description: 'P2 description - Edited',
      status: 'To Do',
      features: [],
    };

    jest
      .spyOn(mockProjectsRepository, 'findOne')
      .mockReturnValueOnce(projectToUpdate);
    jest.spyOn(mockProjectsRepository, 'save').mockReturnValue(updatedProject);
    jest
      .spyOn(mockProjectsRepository, 'findOne')
      .mockReturnValueOnce(projectWithRelations);

    const result = await service.updateProject(field, value, userId, projectId);

    expect(result).toEqual(projectWithRelationsAndStatus);
    expect(mockProjectsRepository.findOne).toHaveBeenCalled();
    expect(mockProjectsRepository.findOne).toHaveBeenCalledWith({
      where: { id: projectId, user: { id: userId } },
    });
    expect(mockProjectsRepository.findOne).toHaveBeenLastCalledWith({
      where: { id: projectId },
      order: {
        features: {
          id: 'ASC',
          userStories: {
            id: 'ASC',
            tasks: {
              id: 'ASC',
            },
          },
        },
      },
      relations: [
        'features',
        'features.userStories',
        'features.userStories.tasks',
      ],
    });
    expect(mockProjectsRepository.save).toHaveBeenCalled();
    expect(mockProjectsRepository.save).toHaveBeenCalledWith(projectToUpdate);
  });

  it('updateProject => throws an error when a project is not found', async () => {
    const field = 'description';
    const value = 'P2 description - Edited';
    const userId = 4;
    const projectId = 21;

    jest.spyOn(mockProjectsRepository, 'findOne').mockReturnValue(undefined);

    expect(async () => {
      await service.updateProject(field, value, userId, projectId);
    }).rejects.toThrow(BadRequestException);
    expect(mockProjectsRepository.findOne).toHaveBeenCalled();
    expect(mockProjectsRepository.findOne).toHaveBeenCalledWith({
      where: { id: projectId, user: { id: userId } },
    });
  });

  it('deleteProject => deletes project found by the passing project id and returns the delete project information', async () => {
    const projectId = 3;
    const userId = 15;

    const projectToDelete = {
      id: 3,
      name: 'P3',
      description: 'asdf',
      user: {
        id: 15,
      },
    };
    const deletedProject = {
      id: 3,
      name: 'P3',
      description: 'asdf',
      user: {
        id: 15,
      },
    };

    jest
      .spyOn(mockProjectsRepository, 'findOne')
      .mockReturnValue(projectToDelete);
    jest
      .spyOn(mockProjectsRepository, 'delete')
      .mockReturnValue(deletedProject);

    const result = await service.deleteProject(projectId, userId);

    expect(result).toEqual(deletedProject);
    expect(mockProjectsRepository.findOne).toHaveBeenCalled();
    expect(mockProjectsRepository.findOne).toHaveBeenCalledWith({
      where: { id: projectId, user: { id: userId } },
    });
    expect(mockProjectsRepository.delete).toHaveBeenCalled();
    expect(mockProjectsRepository.delete).toHaveBeenCalledWith(projectToDelete);
  });

  it('deleteProject => throws an error if project is not found', async () => {
    const projectId = 2;
    const userId = 15;

    jest.spyOn(mockProjectsRepository, 'findOne').mockReturnValue(undefined);

    expect(async () => {
      await service.deleteProject(projectId, userId);
    }).rejects.toThrow(BadRequestException);
    expect(mockProjectsRepository.findOne).toHaveBeenCalled();
    expect(mockProjectsRepository.findOne).toHaveBeenCalledWith({
      where: { id: projectId, user: { id: userId } },
    });
  });
});
