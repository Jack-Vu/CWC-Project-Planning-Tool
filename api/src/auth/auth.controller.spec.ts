import { Test, TestingModule } from '@nestjs/testing';
import {
  AccountDetailDto,
  AuthController,
  FeatureDto,
  LogInDto,
  NewPasswordDto,
  ProjectDto,
  SignUpDto,
  TaskDto,
  UpdateFeatureDto,
  UpdateProjectDto,
  UpdateTaskDto,
  UpdateUserStoryDto,
  UserStoryDto,
} from './auth.controller';
import { AuthGuard } from './auth.guard';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { AuthService } from './auth.service';
import { Project } from '../projects/entities/project.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let service: DeepMocked<AuthService>;

  const mockAuthGuard = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: createMock<AuthService>(),
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('signUp => should add a user to the db and return an access token', async () => {
    const signUpDto = {
      name: 'Jack',
      email: 'jacknvu98@gmail.com',
      username: 'JackV981',
      password: 'fake-password',
    } as SignUpDto;

    const token = 'fake-token';

    service.signUp.mockResolvedValue(token);

    const result = await controller.signUp(signUpDto);

    expect(result).toEqual(token);
    expect(service.signUp).toHaveBeenCalled();
    expect(service.signUp).toHaveBeenCalledWith(signUpDto);
  });

  it('logIn => should verify a user exist and their password is correct and return an access token', async () => {
    const logInDto = {
      username: 'JackV981',
      password: 'fake-password',
    } as LogInDto;

    const token = 'fake-token';

    service.logIn.mockResolvedValue(token);

    const result = await controller.logIn(logInDto);

    expect(result).toEqual(token);
    expect(service.logIn).toHaveBeenCalled();
    expect(service.logIn).toHaveBeenCalledWith(logInDto);
  });

  it('changeAccountDetail => should change an account detail and return the updated user name, email, and username', async () => {
    const accountDetailDto = {
      username: 'JackV981',
      field: 'name',
      value: 'Jack Vu',
    } as AccountDetailDto;

    const updatedUser = {
      name: 'Jack Vu',
      email: 'jacknvu98@gmail.com',
      username: 'JackV981',
    };

    service.changeAccountDetail.mockResolvedValue(updatedUser);

    const result = await controller.changeAccountDetail(accountDetailDto);

    expect(result).toEqual(updatedUser);
    expect(service.changeAccountDetail).toHaveBeenCalled();
    expect(service.changeAccountDetail).toHaveBeenCalledWith(accountDetailDto);
  });

  it('getProfileData => should return the user email, name, and username from their user id', async () => {
    const req: any = {
      user: {
        sub: 25,
      },
    };

    const userData = {
      name: 'Jack Vu',
      email: 'jacknvu98@gmail.com',
      username: 'JackV981',
    };

    service.getProfileData.mockResolvedValue(userData);

    const result = await controller.getProfileData(req);

    expect(result).toEqual(userData);
    expect(service.getProfileData).toHaveBeenCalled();
    expect(service.getProfileData).toHaveBeenCalledWith(req.user.sub);
  });

  it('getUserProjects => should return the user email, name, username along with the user projects from their user id', async () => {
    const req: any = {
      user: {
        sub: 15,
      },
    };

    const returnObject = {
      user: {
        name: 'Jack Vu',
        email: 'jacknvu98@gmail.com',
        username: 'JackV981',
      },
      projects: [],
    };

    service.getUserProjects.mockResolvedValue(returnObject);

    const result = await controller.getUserProjects(req);

    expect(result).toEqual(returnObject);
    expect(service.getUserProjects).toHaveBeenCalled();
    expect(service.getUserProjects).toHaveBeenCalledWith(req.user.sub);
  });

  it('getProjectById => should return return the desired project based on the passed in user and project ids', async () => {
    const id = 1;

    const req: any = {
      user: {
        sub: 15,
      },
    };

    const project = {
      id: 1,
      name: 'P1',
      description: 'P1 desc',
      features: [],
    } as Project;

    service.getProjectById.mockResolvedValue(project);

    const result = await controller.getProjectById(id, req);

    expect(result).toEqual(project);
    expect(service.getProjectById).toHaveBeenCalled();
    expect(service.getProjectById).toHaveBeenCalledWith(id, req.user.sub);
  });

  it("createProject => should create a user project and return all of the user's projects", async () => {
    const projectDto: ProjectDto = {
      name: 'P1',
      description: 'P1 Desc',
    };

    const req = {
      user: {
        sub: 15,
      },
    };

    const projects = [
      { id: 1, name: 'P1', description: 'P1 Desc', features: [] },
    ] as Project[];

    service.createProject.mockResolvedValue(projects);

    const result = await controller.createProject(projectDto, req);

    expect(result).toEqual(projects);
    expect(service.createProject).toHaveBeenCalled();
    expect(service.createProject).toHaveBeenCalledWith(
      projectDto.name,
      projectDto.description,
      req.user.sub,
    );
  });

  it('updateProject => should update a field on a project and return the updated project with statuses', async () => {
    const updateProjectDto = {
      field: 'name',
      value: 'P1 - Edited',
      projectId: 1,
    } as UpdateProjectDto;

    const req = {
      user: {
        sub: 15,
      },
    };

    const projectsWithStatus = {
      id: 1,
      name: 'P1 - Edited',
      description: 'P1 Desc',
      features: [],
      status: 'To Do',
    };

    service.updateProject.mockResolvedValue(projectsWithStatus);

    const result = await controller.updateProject(updateProjectDto, req);

    expect(result).toEqual(projectsWithStatus);
    expect(service.updateProject).toHaveBeenCalled();
    expect(service.updateProject).toHaveBeenCalledWith(
      updateProjectDto.field,
      updateProjectDto.value,
      req.user.sub,
      updateProjectDto.projectId,
    );
  });

  it('deleteProject => should delete a project and return the response from the project repository', async () => {
    const projectId = 1;
    const req = {
      user: { sub: 15 },
    };

    const deleteResult = {
      raw: [],
      affected: 1,
    };

    service.deleteProject.mockResolvedValue(deleteResult);

    const result = await controller.deleteProject(projectId, req);

    expect(result).toEqual(deleteResult);
    expect(service.deleteProject).toHaveBeenCalled();
    expect(service.deleteProject).toHaveBeenCalledWith(projectId, req.user.sub);
  });

  it('createFeature => should create a feature within a specified project and return the updated project', async () => {
    const featureDto: FeatureDto = {
      name: 'F1',
      description: 'F1 Desc',
      projectId: 1,
    };

    const req = {
      user: {
        sub: 15,
      },
    };

    const project = {
      id: 1,
      name: 'P1',
      description: 'P1 Desc',
      status: 'To Do',
      features: [
        {
          id: 1,
          name: 'F1',
          description: 'F1 Desc',
          userStoryCount: 0,
          completedUserStories: 0,
          userStories: [],
        },
      ],
    };

    service.createFeature.mockResolvedValue(project);

    const result = await controller.createFeature(featureDto, req);

    expect(result).toEqual(project);
    expect(service.createFeature).toHaveBeenCalled();
    expect(service.createFeature).toHaveBeenCalledWith(
      featureDto.name,
      featureDto.description,
      req.user.sub,
      featureDto.projectId,
    );
  });

  it('updateFeature => should update a field of a feature and return the updated project with statuses', async () => {
    const updatedFeatureDto = {
      field: 'name',
      value: 'F1 - Edited',
      featureId: 1,
    } as UpdateFeatureDto;

    const req = {
      user: {
        sub: 15,
      },
    };

    const projectWithStatus = {
      id: 1,
      name: 'P1',
      description: 'P1 Desc',
      status: 'To Do',
      features: [
        {
          id: 1,
          name: 'F1 - Edited',
          description: 'F1 Desc',
          userStoryCount: 0,
          completedUserStories: 0,
          userStories: [],
        },
      ],
    };

    service.updateFeature.mockResolvedValue(projectWithStatus);

    const result = await controller.updateFeature(updatedFeatureDto, req);

    expect(result).toEqual(projectWithStatus);
    expect(service.updateFeature).toHaveBeenCalled();
    expect(service.updateFeature).toHaveBeenCalledWith(
      updatedFeatureDto.field,
      updatedFeatureDto.value,
      req.user.sub,
      updatedFeatureDto.featureId,
    );
  });

  it('deleteFeature => should delete a feature and return updated project', async () => {
    const featureId = 1;
    const req = {
      user: { sub: 15 },
    };

    const projectWithStatus = {
      id: 1,
      name: 'P1',
      description: 'P1 Desc',
      status: 'To Do',
      features: [],
    };

    service.deleteFeature.mockResolvedValue(projectWithStatus);

    const result = await controller.deleteFeature(featureId, req);

    expect(result).toEqual(projectWithStatus);
    expect(service.deleteFeature).toHaveBeenCalled();
    expect(service.deleteFeature).toHaveBeenCalledWith(featureId, req.user.sub);
  });

  it('createUserStory => should create a user story within a specified project and feature and return the updated project', async () => {
    const userStoryDto: UserStoryDto = {
      name: 'US1',
      description: 'US1 Desc',
      featureId: 1,
      projectId: 1,
    };

    const req = {
      user: {
        sub: 15,
      },
    };

    const project = {
      id: 1,
      name: 'P1',
      description: 'P1 Desc',
      status: 'To Do',
      features: [
        {
          id: 1,
          name: 'F1',
          description: 'F1 Desc',
          userStoryCount: 1,
          completedUserStories: 0,
          userStories: [
            {
              id: 1,
              name: 'US1',
              description: 'US1 Desc',
              tasksCount: 0,
              completedTasks: 0,
              tasks: [],
            },
          ],
        },
      ],
    };

    service.createUserStory.mockResolvedValue(project);

    const result = await controller.createUserStory(userStoryDto, req);

    expect(result).toEqual(project);
    expect(service.createUserStory).toHaveBeenCalled();
    expect(service.createUserStory).toHaveBeenCalledWith(
      userStoryDto.name,
      userStoryDto.description,
      req.user.sub,
      userStoryDto.projectId,
      userStoryDto.featureId,
    );
  });

  it('updateUserStory=> should update a field of a user story and return the updated project with statuses', async () => {
    const updateUserStoryDto = {
      field: 'name',
      value: 'US1 - Edited',
      featureId: 1,
      userStoryId: 1,
    } as UpdateUserStoryDto;

    const req = {
      user: {
        sub: 15,
      },
    };

    const projectWithStatues = {
      id: 1,
      name: 'P1',
      description: 'P1 Desc',
      status: 'To Do',
      features: [
        {
          id: 1,
          name: 'F1',
          description: 'F1 Desc',
          userStoryCount: 1,
          completedUserStories: 0,
          userStories: [
            {
              id: 1,
              name: 'US1 - Edited',
              description: 'US1 Desc',
              tasksCount: 0,
              completedTasks: 0,
              tasks: [],
            },
          ],
        },
      ],
    };

    service.updateUserStory.mockResolvedValue(projectWithStatues);

    const result = await controller.updateUserStory(updateUserStoryDto, req);

    expect(result).toEqual(projectWithStatues);
    expect(service.updateUserStory).toHaveBeenCalled();
    expect(service.updateUserStory).toHaveBeenCalledWith(
      updateUserStoryDto.field,
      updateUserStoryDto.value,
      req.user.sub,
      updateUserStoryDto.userStoryId,
    );
  });

  it('deleteUserStory => should delete a user story and return updated project', async () => {
    const userStoryId = 1;
    const req = {
      user: { sub: 15 },
    };

    const projectWithStatues = {
      id: 1,
      name: 'P1',
      description: 'P1 Desc',
      status: 'To Do',
      features: [
        {
          id: 1,
          name: 'F1',
          description: 'F1 Desc',
          userStoryCount: 0,
          completedUserStories: 0,
          userStories: [],
        },
      ],
    };

    service.deleteUserStory.mockResolvedValue(projectWithStatues);

    const result = await controller.deleteUserStory(userStoryId, req);

    expect(result).toEqual(projectWithStatues);
    expect(service.deleteUserStory).toHaveBeenCalled();
    expect(service.deleteUserStory).toHaveBeenCalledWith(
      userStoryId,
      req.user.sub,
    );
  });

  it('createTask => should create a task within a specified project, feature, and user story and return the updated project', async () => {
    const taskDto: TaskDto = {
      name: 'T1',
      featureId: 1,
      projectId: 1,
      userStoryId: 1,
    };

    const req = {
      user: {
        sub: 15,
      },
    };

    const projectWithStatus = {
      id: 1,
      name: 'P1',
      description: 'P1 Desc',
      status: 'To Do',
      features: [
        {
          id: 1,
          name: 'F1',
          description: 'F1 Desc',
          userStoryCount: 1,
          completedUserStories: 0,
          userStories: [
            {
              id: 1,
              name: 'US1',
              description: 'US1 Desc',
              tasksCount: 1,
              completedTasks: 0,
              tasks: [
                {
                  id: 1,
                  name: 'T1',
                  status: 'To Do',
                },
              ],
            },
          ],
        },
      ],
    };

    service.createTask.mockResolvedValue(projectWithStatus);

    const result = await controller.createTask(taskDto, req);

    expect(result).toEqual(projectWithStatus);
    expect(service.createTask).toHaveBeenCalled();
    expect(service.createTask).toHaveBeenCalledWith(
      taskDto.name,
      req.user.sub,
      taskDto.projectId,
      taskDto.featureId,
      taskDto.userStoryId,
    );
  });

  it('updateTask => should update a field of a task and return the story status and task list', async () => {
    const updateTaskDto: UpdateTaskDto = {
      field: 'name',
      value: 'T1 - Edited',
      taskId: 1,
    };

    const req = {
      user: {
        sub: 15,
      },
    };

    const returnObject = {
      storyStatus: '1/1',
      taskList: [{ name: 'T1', status: 'Done!' }],
    };

    service.updateTask.mockResolvedValue(returnObject);

    const result = await controller.updateTask(updateTaskDto, req);

    expect(result).toEqual(returnObject);
    expect(service.updateTask).toHaveBeenCalled();
    expect(service.updateTask).toHaveBeenCalledWith(
      updateTaskDto.field,
      updateTaskDto.value,
      req.user.sub,
      updateTaskDto.taskId,
    );
  });

  it('deleteTask => should delete a task and return the story status and task list', async () => {
    const taskId = 1;
    const req = {
      user: { sub: 15 },
    };

    const returnObject = {
      storyStatus: '0/0',
      taskList: [],
    };

    service.deleteTask.mockResolvedValue(returnObject);

    const result = await controller.deleteTask(taskId, req);

    expect(result).toEqual(returnObject);
    expect(service.deleteTask).toHaveBeenCalled();
    expect(service.deleteTask).toHaveBeenCalledWith(taskId, req.user.sub);
  });

  it('saveNewPassword => should update the user password and return the user email, name, and username', async () => {
    const body: NewPasswordDto = {
      newPassword: 'new-password',
      id: 15,
      token: 'fake-token',
    };

    const updatedUser = {
      email: 'jacknvu98@gmail.com',
      name: 'Jack Vu',
      username: 'JackV981',
    };

    service.saveNewPassword.mockResolvedValue(updatedUser);

    const result = await controller.saveNewPassword(body);

    expect(result).toEqual(updatedUser);
    expect(service.saveNewPassword).toHaveBeenCalled();
    expect(service.saveNewPassword).toHaveBeenCalledWith(
      body.newPassword,
      body.id,
      body.token,
    );
  });

  it('deleteUser => should delete user and return the delete result', async () => {
    const req = {
      user: {
        sub: 15,
      },
    };

    const deleteResult = {
      raw: [],
      affected: 1,
    };

    service.deleteUser.mockResolvedValue(deleteResult);

    const result = await controller.deleteUser(req);

    expect(result).toEqual(deleteResult);
    expect(service.deleteUser).toHaveBeenCalled();
    expect(service.deleteUser).toHaveBeenCalledWith(req.user.sub);
  });

  it('sendResetPasswordEmail => should send a password rest email to a user', async () => {
    const body = { email: 'jacknvu98@gmail.com' };

    service.sendResetPasswordEmail.mockResolvedValue(undefined);

    const result = await controller.sendResetPasswordEmail(body.email);

    expect(result).toBeUndefined();
    expect(service.sendResetPasswordEmail).toHaveBeenCalled();
    expect(service.sendResetPasswordEmail).toHaveBeenCalledWith(body.email);
  });
});
