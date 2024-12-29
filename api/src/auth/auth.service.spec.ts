import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ProjectsService } from '../projects/projects.service';
import { FeaturesService } from '../features/features.service';
import { UserStoriesService } from '../userStories/userStories.service';
import { TasksService } from '../tasks/tasks.service';
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: DeepMocked<UsersService>;
  let projectsService: DeepMocked<ProjectsService>;
  let featuresService: DeepMocked<FeaturesService>;
  let userStoriesService: DeepMocked<UserStoriesService>;
  let tasksService: DeepMocked<TasksService>;
  let mailService: DeepMocked<MailService>;
  let jwtService: DeepMocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: createMock<UsersService>(),
        },
        {
          provide: ProjectsService,
          useValue: createMock<ProjectsService>(),
        },
        {
          provide: FeaturesService,
          useValue: createMock<FeaturesService>(),
        },
        {
          provide: UserStoriesService,
          useValue: createMock<UserStoriesService>(),
        },
        {
          provide: TasksService,
          useValue: createMock<TasksService>(),
        },
        {
          provide: MailService,
          useValue: createMock<MailService>(),
        },
        {
          provide: JwtService,
          useValue: createMock<JwtService>(),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    projectsService = module.get(ProjectsService);
    featuresService = module.get(FeaturesService);
    userStoriesService = module.get(UserStoriesService);
    tasksService = module.get(TasksService);
    mailService = module.get(MailService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(usersService).toBeDefined();
    expect(projectsService).toBeDefined();
    expect(featuresService).toBeDefined();
    expect(userStoriesService).toBeDefined();
    expect(tasksService).toBeDefined();
    expect(mailService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  it('hashPassword => should return a hashed version of the passed in password', async () => {
    const password = 'fake-password';
    const hashedPassword = 'hashed-fake-password';

    const bcryptHash = jest.fn().mockReturnValue(hashedPassword);
    (bcrypt.hash as jest.Mock) = bcryptHash;

    const result = await service.hashPassword(password);

    expect(result).toEqual(hashedPassword);
    expect(bcryptHash).toHaveBeenCalled();
    expect(bcryptHash).toHaveBeenCalledWith(password, 10);
  });

  it('createAccessToken => should return a JWT without inputting a secret', async () => {
    const user = { id: 15 } as User;

    const token = 'fake-jwt';

    jwtService.signAsync.mockResolvedValue(token);

    const result = await service.createAccessToken(user);

    expect(result).toEqual(token);
    expect(jwtService.signAsync).toHaveBeenCalled();
    expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: user.id });
  });

  it('createAccessToken => should return a JWT while passing in a secret', async () => {
    const user = { id: 15 } as User;
    const secret = 'fake-secret';

    const token = 'fake-jwt';

    jwtService.signAsync.mockResolvedValue(token);

    const result = await service.createAccessToken(user, secret);

    expect(result).toEqual(token);
    expect(jwtService.signAsync).toHaveBeenCalled();
    expect(jwtService.signAsync).toHaveBeenCalledWith(
      { sub: user.id },
      {
        secret,
        expiresIn: '10m',
      },
    );
  });

  it('verifyUniqueUsername => should return false if user with username exist', async () => {
    const username = 'JackV981';
    const user = {
      id: 15,
      username: 'JackV981',
      name: 'Jack',
      email: 'jacknvu98@gmail.com',
      password: 'fake-password',
    } as User;

    usersService.findUserByUsername.mockResolvedValue(user);

    const result = await service.verifyUniqueUsername(username);

    expect(result).toEqual(false);
    expect(usersService.findUserByUsername).toHaveBeenCalled();
    expect(usersService.findUserByUsername).toHaveBeenCalledWith(username);
  });

  it('verifyUniqueUsername => should return true if user with username does not exist', async () => {
    const username = 'does not exist';

    usersService.findUserByUsername.mockResolvedValue(undefined);

    const result = await service.verifyUniqueUsername(username);

    expect(result).toEqual(true);
    expect(usersService.findUserByUsername).toHaveBeenCalled();
    expect(usersService.findUserByUsername).toHaveBeenCalledWith(username);
  });
});
