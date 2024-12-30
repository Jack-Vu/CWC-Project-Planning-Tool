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
import { AccountDetailDto, LogInDto, SignUpDto } from './auth.controller';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserStory } from '../userStories/entities/userStory.entity';

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

  it('verifyUniqueEmail => should return false if user with email exist', async () => {
    const email = 'jacknvu98@gmail.com';
    const user = {
      id: 15,
      username: 'JackV981',
      name: 'Jack',
      email: 'jacknvu98@gmail.com',
      password: 'fake-password',
    } as User;

    usersService.findUserByEmail.mockResolvedValue(user);

    const result = await service.verifyUniqueEmail(email);

    expect(result).toEqual(false);
    expect(usersService.findUserByEmail).toHaveBeenCalled();
    expect(usersService.findUserByEmail).toHaveBeenCalledWith(email);
  });

  it('verifyUniqueEmail => should return true if user with email does not exist', async () => {
    const email = 'doesnotexist@gmail.com';

    usersService.findUserByEmail.mockResolvedValue(undefined);

    const result = await service.verifyUniqueEmail(email);

    expect(result).toEqual(true);
    expect(usersService.findUserByEmail).toHaveBeenCalled();
    expect(usersService.findUserByEmail).toHaveBeenCalledWith(email);
  });

  it('signUp => should return an access token if username and email are unique', async () => {
    const signUpDto = {
      name: 'Jack Vu',
      username: 'JackV981',
      password: 'fake-password',
      email: 'jacknvu98@gmail.com',
    } as SignUpDto;

    const user = {
      id: 1,
      name: 'Jack Vu',
      username: 'JackV981',
      password: 'hashed-fake-password',
      email: 'jacknvu98@gmail.com',
    } as User;

    usersService.findUserByUsername.mockResolvedValue(undefined);
    usersService.findUserByEmail.mockResolvedValue(undefined);

    const hashedPassword = 'hashed-fake-password';

    const bcryptHash = jest.fn().mockReturnValue(hashedPassword);
    (bcrypt.hash as jest.Mock) = bcryptHash;

    usersService.createUser.mockResolvedValue(user);

    const token = 'fake-jwt';

    jwtService.signAsync.mockResolvedValue(token);

    const result = await service.signUp(signUpDto);

    expect(result).toEqual(token);
    expect(usersService.findUserByUsername).toHaveBeenCalled();
    expect(usersService.findUserByUsername).toHaveBeenCalledWith(
      signUpDto.username,
    );
    expect(usersService.findUserByEmail).toHaveBeenCalled();
    expect(usersService.findUserByEmail).toHaveBeenCalledWith(signUpDto.email);
    expect(bcryptHash).toHaveBeenCalled();
    expect(bcryptHash).toHaveBeenCalledWith('fake-password', 10);
    expect(usersService.createUser).toHaveBeenCalled();
    expect(usersService.createUser).toHaveBeenCalledWith(signUpDto);
    expect(jwtService.signAsync).toHaveBeenCalled();
    expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: user.id });
  });

  it('signUp => should throw an error that username already exist', async () => {
    const signUpDto = {
      name: 'Jack Vu',
      username: 'JackV981',
      password: 'fake-password',
      email: 'jacknvu98@gmail.com',
    } as SignUpDto;

    const user = {
      id: 1,
      name: 'Jack Vu',
      username: 'JackV981',
      password: 'hashed-fake-password',
      email: 'jacknvu98@gmail.com',
    } as User;

    usersService.findUserByUsername.mockResolvedValue(user);

    expect(async () => {
      await service.signUp(signUpDto);
    }).rejects.toThrow(BadRequestException);
    expect(usersService.findUserByUsername).toHaveBeenCalled();
    expect(usersService.findUserByUsername).toHaveBeenCalledWith(
      signUpDto.username,
    );
  });

  it('signUp => should throw an error that email already exist', async () => {
    const signUpDto = {
      name: 'Jack Vu',
      username: 'JackV981',
      password: 'fake-password',
      email: 'jacknvu98@gmail.com',
    } as SignUpDto;

    const user = {
      id: 1,
      name: 'Jack Vu',
      username: 'JackV981',
      password: 'hashed-fake-password',
      email: 'jacknvu98@gmail.com',
    } as User;

    usersService.findUserByUsername.mockResolvedValue(undefined);
    usersService.findUserByEmail.mockResolvedValue(user);

    try {
      await service.signUp(signUpDto);
    } catch (error) {
      expect(error.message).toBe('Bad Request!');
      expect(usersService.findUserByUsername).toHaveBeenCalled();
      expect(usersService.findUserByUsername).toHaveBeenCalledWith(
        signUpDto.username,
      );
      expect(usersService.findUserByEmail).toHaveBeenCalled();
      expect(usersService.findUserByEmail).toHaveBeenCalledWith(
        signUpDto.email,
      );
    }
  });

  it('verifyPassword => should return true if entered password matches existing hashed password', async () => {
    const enteredPassword = 'plain-text-password';
    const existingPassword = 'matching-hashed-password';

    const bcryptCompare = jest.fn().mockReturnValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    const result = await service.verifyPassword(
      enteredPassword,
      existingPassword,
    );

    expect(result).toEqual(true);
    expect(bcryptCompare).toHaveBeenCalled();
    expect(bcryptCompare).toHaveBeenCalledWith(
      enteredPassword,
      existingPassword,
    );
  });

  it('verifyPassword => should return false if entered password does not match existing hashed password', async () => {
    const enteredPassword = 'plain-text-password';
    const existingPassword = 'not-matching-hashed-password';

    const bcryptCompare = jest.fn().mockReturnValue(false);
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    const result = await service.verifyPassword(
      enteredPassword,
      existingPassword,
    );

    expect(result).toEqual(false);
    expect(bcryptCompare).toHaveBeenCalled();
    expect(bcryptCompare).toHaveBeenCalledWith(
      enteredPassword,
      existingPassword,
    );
  });

  it('logIn => should return access token if user exist and passwords match', async () => {
    const logInDto = {
      username: 'JackV981',
      password: 'fake-password',
    } as LogInDto;

    const user = {
      id: 1,
      name: 'Jack Vu',
      username: 'JackV981',
      password: 'hashed-fake-password',
      email: 'jacknvu98@gmail.com',
    } as User;

    const token = 'fake-jwt';

    usersService.findUserByUsername.mockResolvedValue(user);

    const bcryptCompare = jest.fn().mockReturnValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    jwtService.signAsync.mockResolvedValue(token);

    const result = await service.logIn(logInDto);

    expect(result).toEqual(token);
    expect(usersService.findUserByUsername).toHaveBeenCalled();
    expect(usersService.findUserByUsername).toHaveBeenCalledWith(
      logInDto.username,
    );
    expect(bcryptCompare).toHaveBeenCalled();
    expect(bcryptCompare).toHaveBeenCalledWith(
      logInDto.password,
      user.password,
    );
    expect(jwtService.signAsync).toHaveBeenCalled();
    expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: user.id });
  });

  it('logIn => should throw unauthorized error if user exist and passwords do not match', async () => {
    const logInDto = {
      username: 'JackV981',
      password: 'incorrect-password',
    } as LogInDto;

    const user = {
      id: 1,
      name: 'Jack Vu',
      username: 'JackV981',
      password: 'hashed-fake-password',
      email: 'jacknvu98@gmail.com',
    } as User;

    usersService.findUserByUsername.mockResolvedValue(user);

    const bcryptCompare = jest.fn().mockReturnValue(false);
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    try {
      await service.logIn(logInDto);
    } catch (error) {
      expect(error.message).toEqual('Unauthorized!');
      expect(usersService.findUserByUsername).toHaveBeenCalled();
      expect(usersService.findUserByUsername).toHaveBeenCalledWith(
        logInDto.username,
      );
      expect(bcryptCompare).toHaveBeenCalled();
      expect(bcryptCompare).toHaveBeenCalledWith(
        logInDto.password,
        user.password,
      );
    }
  });

  it('logIn => should throw unauthorized error if user does not exist', async () => {
    const logInDto = {
      username: 'fake-user',
      password: 'incorrect-password',
    } as LogInDto;

    usersService.findUserByUsername.mockResolvedValue(undefined);

    try {
      await service.logIn(logInDto);
    } catch (error) {
      expect(error.message).toEqual('Unauthorized!');
      expect(usersService.findUserByUsername).toHaveBeenCalled();
      expect(usersService.findUserByUsername).toHaveBeenCalledWith(
        logInDto.username,
      );
    }
  });

  it('changeAccountDetail => should return name, email, username after hashing and changing user password', async () => {
    const accountDetailDto = {
      field: 'password',
      username: 'JackV981',
      value: 'new-password',
    } as AccountDetailDto;

    const user = {
      id: 15,
      name: 'Jack Vu',
      username: 'JackV981',
      email: 'jacknvu98@gmail.com',
      password: 'fake-hashed-password',
    } as User;

    const updatedUser = {
      id: 15,
      name: 'Jack Vu',
      username: 'JackV981',
      email: 'jacknvu98@gmail.com',
      password: 'hashed-new-password',
    } as User;

    const hashedNewPassword = 'hashed-new-password';

    usersService.findUserByUsername.mockResolvedValue(user);

    const bcryptHash = jest.fn().mockReturnValue(hashedNewPassword);
    (bcrypt.hash as jest.Mock) = bcryptHash;

    usersService.createUser.mockResolvedValue(updatedUser);

    const result = await service.changeAccountDetail(accountDetailDto);

    expect(result).toEqual({
      name: updatedUser.name,
      email: updatedUser.email,
      username: updatedUser.username,
    });
    expect(usersService.findUserByUsername).toHaveBeenCalled();
    expect(usersService.findUserByUsername).toHaveBeenCalledWith(
      accountDetailDto.username,
    );
    expect(usersService.createUser).toHaveBeenCalled();
    expect(usersService.createUser).toHaveBeenCalledWith(updatedUser);
    expect(bcryptHash).toHaveBeenCalled();
    expect(bcryptHash).toHaveBeenCalledWith(accountDetailDto.value, 10);
  });

  it('changeAccountDetail => should return name, email, username after changing user username', async () => {
    const accountDetailDto = {
      field: 'username',
      username: 'JackV981',
      value: 'JackV9812',
    } as AccountDetailDto;

    const user = {
      id: 15,
      name: 'Jack Vu',
      username: 'JackV981',
      email: 'jacknvu98@gmail.com',
      password: 'fake-hashed-password',
    } as User;

    const updatedUser = {
      id: 15,
      name: 'Jack Vu',
      username: 'JackV9812',
      email: 'jacknvu98@gmail.com',
      password: 'fake-hashed-password',
    } as User;

    usersService.findUserByUsername.mockResolvedValueOnce(user);
    usersService.createUser.mockResolvedValue(updatedUser);
    usersService.findUserByUsername.mockResolvedValueOnce(undefined);

    const result = await service.changeAccountDetail(accountDetailDto);

    expect(result).toEqual({
      name: updatedUser.name,
      email: updatedUser.email,
      username: updatedUser.username,
    });
    expect(usersService.findUserByUsername).toHaveBeenCalled();
    expect(usersService.findUserByUsername).toHaveBeenCalledWith(
      accountDetailDto.username,
    );
    expect(usersService.createUser).toHaveBeenCalled();
    expect(usersService.createUser).toHaveBeenCalledWith(updatedUser);
  });

  it('changeAccountDetail => should return name, email, username after changing user email', async () => {
    const accountDetailDto = {
      field: 'email',
      username: 'JackV981',
      value: 'jacknvu@gmail.com',
    } as AccountDetailDto;

    const user = {
      id: 15,
      name: 'Jack Vu',
      username: 'JackV981',
      email: 'jacknvu98@gmail.com',
      password: 'fake-hashed-password',
    } as User;

    const updatedUser = {
      id: 15,
      name: 'Jack Vu',
      username: 'JackV981',
      email: 'jacknvu@gmail.com',
      password: 'fake-hashed-password',
    } as User;

    usersService.findUserByUsername.mockResolvedValue(user);
    usersService.createUser.mockResolvedValue(updatedUser);
    usersService.findUserByEmail.mockResolvedValue(undefined);

    const result = await service.changeAccountDetail(accountDetailDto);

    expect(result).toEqual({
      name: updatedUser.name,
      email: updatedUser.email,
      username: updatedUser.username,
    });
    expect(usersService.findUserByUsername).toHaveBeenCalled();
    expect(usersService.findUserByUsername).toHaveBeenCalledWith(
      accountDetailDto.username,
    );
    expect(usersService.findUserByEmail).toHaveBeenCalled();
    expect(usersService.findUserByEmail).toHaveBeenCalledWith(
      accountDetailDto.value,
    );
    expect(usersService.createUser).toHaveBeenCalled();
    expect(usersService.createUser).toHaveBeenCalledWith(updatedUser);
  });

  it('changeAccountDetail => should throws an error if new username is duplicate', async () => {
    const accountDetailDto = {
      field: 'username',
      username: 'JackV981',
      value: 'codingDupe',
    } as AccountDetailDto;

    const user = {
      id: 15,
      name: 'Jack Vu',
      username: 'JackV981',
      email: 'jacknvu98@gmail.com',
      password: 'fake-hashed-password',
    } as User;

    const duplicateUser = {
      id: 12,
      name: 'Duppy',
      username: 'codingDupe',
      email: 'dup@gmail.com',
      password: 'hashed-fake-password',
    } as User;

    usersService.findUserByUsername.mockResolvedValueOnce(user);
    usersService.findUserByUsername.mockResolvedValueOnce(duplicateUser);

    try {
      await service.changeAccountDetail(accountDetailDto);
    } catch (error) {
      expect(error.message).toBe('Bad request!');
      expect(usersService.findUserByUsername).toHaveBeenCalled();
      expect(usersService.findUserByUsername).toHaveBeenCalledWith(
        accountDetailDto.username,
      );
    }
  });

  it('changeAccountDetail => should throws an error if new email is duplicate', async () => {
    const accountDetailDto = {
      field: 'email',
      username: 'JackV981',
      value: 'dup@gmail.com',
    } as AccountDetailDto;

    const user = {
      id: 15,
      name: 'Jack Vu',
      username: 'JackV981',
      email: 'jacknvu98@gmail.com',
      password: 'fake-hashed-password',
    } as User;

    const duplicateUser = {
      id: 12,
      name: 'Duppy',
      username: 'codingDupe',
      email: 'dup@gmail.com',
      password: 'hashed-fake-password',
    } as User;

    usersService.findUserByUsername.mockResolvedValueOnce(user);
    usersService.findUserByEmail.mockResolvedValueOnce(duplicateUser);

    try {
      await service.changeAccountDetail(accountDetailDto);
    } catch (error) {
      expect(error.message).toEqual('Bad request!');
      expect(usersService.findUserByUsername).toHaveBeenCalled();
      expect(usersService.findUserByUsername).toHaveBeenCalledWith(
        accountDetailDto.username,
      );
      expect(usersService.findUserByEmail).toHaveBeenCalled();
      expect(usersService.findUserByEmail).toHaveBeenCalledWith(
        accountDetailDto.value,
      );
    }
  });

  it('changeAccountDetail => should return name, email, username after changing user name', async () => {
    const accountDetailDto = {
      field: 'name',
      username: 'JackV981',
      value: 'Jack',
    } as AccountDetailDto;

    const user = {
      id: 15,
      name: 'Jack Vu',
      username: 'JackV981',
      email: 'jacknvu98@gmail.com',
      password: 'fake-hashed-password',
    } as User;

    const updatedUser = {
      id: 15,
      name: 'Jack',
      username: 'JackV981',
      email: 'jacknvu98@gmail.com',
      password: 'fake-hashed-password',
    } as User;

    usersService.findUserByUsername.mockResolvedValue(user);
    usersService.createUser.mockResolvedValue(updatedUser);

    const result = await service.changeAccountDetail(accountDetailDto);

    expect(result).toEqual({
      name: updatedUser.name,
      email: updatedUser.email,
      username: updatedUser.username,
    });
    expect(usersService.findUserByUsername).toHaveBeenCalled();
    expect(usersService.findUserByUsername).toHaveBeenCalledWith(
      accountDetailDto.username,
    );
    expect(usersService.createUser).toHaveBeenCalled();
    expect(usersService.createUser).toHaveBeenCalledWith(updatedUser);
  });

  it('getProfileData => should return name, email, username corresponding to passed in user id', async () => {
    const id = 15;

    const user = {
      id: 15,
      name: 'Jack Vu',
      username: 'JackV981',
      email: 'jacknvu98@gmail.com',
      password: 'fake-hashed-password',
    } as User;

    const returningUser = {
      name: user.name,
      email: user.email,
      username: user.username,
    };
    usersService.findUserById.mockResolvedValue(user);

    const result = await service.getProfileData(id);

    expect(result).toEqual(returningUser);
    expect(usersService.findUserById).toHaveBeenCalled();
    expect(usersService.findUserById).toHaveBeenCalledWith(id);
  });

  it('saveNewPassword => should throw an unauthorized error when token is invalid', async () => {
    const newPassword = 'fake-new-password';
    const id = 15;
    const token = 'fake-token';

    const user = {
      id: 15,
      name: 'Jack Vu',
      username: 'JackV981',
      email: 'jacknvu98@gmail.com',
      password: 'fake-hashed-password',
    } as User;

    usersService.findUserById.mockResolvedValue(user);
    jwtService.verifyAsync.mockRejectedValue(
      new UnauthorizedException('token is invalid'),
    );

    try {
      await service.saveNewPassword(newPassword, id, token);
    } catch (error) {
      expect(error.message).toEqual('token is invalid');
      expect(usersService.findUserById).toHaveBeenCalled();
      expect(usersService.findUserById).toHaveBeenCalledWith(id);
      expect(jwtService.verifyAsync).toHaveBeenCalled();
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(token, {
        secret: user.password,
      });
    }
  });

  it('saveNewPassword => should return user email, name , and username after updating the user password', async () => {
    const newPassword = 'fake-new-password';
    const id = 15;
    const token = 'valid-token';

    const user = {
      id: 15,
      name: 'Jack Vu',
      username: 'JackV981',
      email: 'jacknvu98@gmail.com',
      password: 'fake-hashed-password',
    } as User;

    const hashedPassword = 'hashed-fake-new-password';

    const updatedUser = {
      id: 15,
      name: 'Jack Vu',
      username: 'JackV981',
      email: 'jacknvu98@gmail.com',
      password: hashedPassword,
    } as User;

    usersService.findUserById.mockResolvedValue(user);
    jwtService.verifyAsync.mockResolvedValue({});
    const bcryptHash = jest.fn().mockReturnValue(hashedPassword);
    (bcrypt.hash as jest.Mock) = bcryptHash;
    usersService.createUser.mockResolvedValue(updatedUser);

    const result = await service.saveNewPassword(newPassword, id, token);

    expect(result).toEqual({
      name: updatedUser.name,
      email: updatedUser.email,
      username: updatedUser.username,
    });
    expect(usersService.findUserById).toHaveBeenCalled();
    expect(usersService.findUserById).toHaveBeenCalledWith(id);
    expect(jwtService.verifyAsync).toHaveBeenCalled();
    expect(jwtService.verifyAsync).toHaveBeenCalledWith(token, {
      secret: 'fake-hashed-password',
    });
    expect(bcryptHash).toHaveBeenCalled();
    expect(bcryptHash).toHaveBeenCalledWith(newPassword, 10);
    expect(usersService.createUser).toHaveBeenCalled();
    expect(usersService.createUser).toHaveBeenCalledWith(user);
  });

  it('deleteUser => should called users service delete user method and return the deleted user', async () => {
    const id = 15;

    const deletedResult = {
      raw: [],
      affected: 1,
    };

    usersService.deleteUser.mockResolvedValue(deletedResult);

    const result = await service.deleteUser(id);

    expect(result).toEqual(deletedResult);
    expect(usersService.deleteUser).toHaveBeenCalled();
    expect(usersService.deleteUser).toHaveBeenCalledWith(id);
  });

  it('getUserProjects => should return users projects based on corresponding useId', async () => {
    const userId = 15;

    const projectsWithStatues = [
      {
        id: 1,
        user: { id: 15 },
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
        user: { id: 15 },
        description: 'P2 description',
        status: 'To Do',
        features: [],
      },
    ];

    projectsService.getUserProjects.mockResolvedValue(projectsWithStatues);

    const result = await service.getUserProjects(userId);

    expect(result).toEqual(projectsWithStatues);
    expect(projectsService.getUserProjects).toHaveBeenCalled();
    expect(projectsService.getUserProjects).toHaveBeenCalledWith(userId);
  });

  it('getProjectById => should return a project based on corresponding project id and user id', async () => {
    const userId = 15;
    const projectId = 1;

    const projectsWithStatues = [
      {
        id: 1,
        user: { id: 15 },
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
        user: { id: 15 },
        description: 'P2 description',
        status: 'To Do',
        features: [],
      },
    ];

    projectsService.getUserProjects.mockResolvedValue(projectsWithStatues);

    const result = await service.getProjectById(projectId, userId);

    expect(result).toEqual(projectsWithStatues[0]);
    expect(projectsService.getUserProjects).toHaveBeenCalled();
    expect(projectsService.getUserProjects).toHaveBeenCalledWith(userId);
  });

  it('updateProject => should update project value', async () => {
    const field = 'name';
    const value = 'P1 - Edited';
    const userId = 15;
    const projectId = 1;

    const updatedProject = {
      id: 1,
      user: { id: 15 },
      name: 'P1 - Edited',
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

    projectsService.updateProject.mockResolvedValue(updatedProject);

    const result = await service.updateProject(field, value, userId, projectId);

    expect(result).toEqual(updatedProject);
    expect(projectsService.updateProject).toHaveBeenCalled();
    expect(projectsService.updateProject).toHaveBeenCalledWith(
      field,
      value,
      userId,
      projectId,
    );
  });

  it('deleteProject => should return a delete result after calling the deleteProject method in projectsService', async () => {
    const projectId = 1;
    const userId = 15;

    const deletedResult = {
      raw: [],
      affected: 1,
    };

    projectsService.deleteProject.mockResolvedValue(deletedResult);

    const result = await service.deleteProject(projectId, userId);

    expect(result).toEqual(deletedResult);
    expect(projectsService.deleteProject).toHaveBeenCalled();
    expect(projectsService.deleteProject).toHaveBeenCalledWith(
      projectId,
      userId,
    );
  });

  it('createFeature => should create a feature to an existing project and return the updated project', async () => {
    const name = 'F1';
    const description = 'F1 Desc';
    const userId = 15;
    const projectId = 2;

    const projectsWithStatues = [
      {
        id: 1,
        user: { id: 15 },
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
        user: { id: 15 },
        description: 'P2 description',
        status: 'To Do',
        features: [],
      },
    ];

    const updatedProject = {
      id: 2,
      name: 'P2',
      user: { id: 15 },
      description: 'P2 description',
      status: 'To Do',
      features: [
        {
          id: 3,
          name: 'F1',
          description: 'F1 Desc',
          userStoryCount: 0,
          completedUserStories: 0,
          status: 'To Do',
          userStories: [],
        },
      ],
    };

    projectsService.getUserProjects.mockResolvedValue(projectsWithStatues);
    projectsService.getProjectById.mockResolvedValue(updatedProject);

    const result = await service.createFeature(
      name,
      description,
      userId,
      projectId,
    );

    expect(result).toEqual(updatedProject);
    expect(projectsService.getUserProjects).toHaveBeenCalled();
    expect(projectsService.getUserProjects).toHaveBeenCalledWith(userId);
    expect(featuresService.createFeature).toHaveBeenCalled();
    expect(featuresService.createFeature).toHaveBeenCalledWith(
      name,
      description,
      projectId,
    );
    expect(projectsService.getProjectById).toHaveBeenCalled();
    expect(projectsService.getProjectById).toHaveBeenCalledWith(projectId);
  });

  it('createFeature => should throw unauthorized error when project is undefined', async () => {
    const name = 'F1';
    const description = 'F1 Desc';
    const userId = 1;
    const projectId = 40;

    const projectsWithStatues = [
      {
        id: 1,
        user: { id: 15 },
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
        user: { id: 15 },
        description: 'P2 description',
        status: 'To Do',
        features: [],
      },
    ];

    projectsService.getUserProjects.mockResolvedValue(projectsWithStatues);

    try {
      await service.createFeature(name, description, userId, projectId);
    } catch (error) {
      expect(error).toEqual(new UnauthorizedException('Unauthorized!'));
      expect(projectsService.getUserProjects).toHaveBeenCalled();
      expect(projectsService.getUserProjects).toHaveBeenCalledWith(userId);
    }
  });

  it('updateFeature => should call the featuresService updateFeature method and return the updated project', async () => {
    const field = 'name';
    const value = 'F1 - Edited';
    const userId = 15;
    const featureId = 3;

    const projectId = 2;

    const updatedProject = {
      id: 2,
      name: 'P2',
      user: { id: 15 },
      description: 'P2 description',
      status: 'To Do',
      features: [
        {
          id: 3,
          name: 'F1 - Edited',
          description: 'F1 Desc',
          userStoryCount: 0,
          completedUserStories: 0,
          status: 'To Do',
          userStories: [],
        },
      ],
    };

    featuresService.updateFeature.mockResolvedValue(projectId);
    projectsService.getProjectById.mockResolvedValue(updatedProject);

    const result = await service.updateFeature(field, value, userId, featureId);

    expect(result).toEqual(updatedProject);
    expect(featuresService.updateFeature).toHaveBeenCalled();
    expect(featuresService.updateFeature).toHaveBeenCalledWith(
      field,
      value,
      userId,
      featureId,
    );
    expect(projectsService.getProjectById).toHaveBeenCalled();
    expect(projectsService.getProjectById).toHaveBeenCalledWith(projectId);
  });

  it('deleteFeature => should delete the feature and return the updated project', async () => {
    const featureId = 3;
    const userId = 15;

    const projectId = 1;

    const projectWithStatues = {
      id: 1,
      user: { id: 15 },
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

    featuresService.deleteFeature.mockResolvedValue(projectId);
    projectsService.getProjectById.mockResolvedValue(projectWithStatues);

    const result = await service.deleteFeature(featureId, userId);

    expect(result).toEqual(projectWithStatues);
    expect(featuresService.deleteFeature).toHaveBeenCalled();
    expect(featuresService.deleteFeature).toHaveBeenCalledWith(
      featureId,
      userId,
    );
    expect(projectsService.getProjectById).toHaveBeenCalled();
    expect(projectsService.getProjectById).toHaveBeenCalledWith(projectId);
  });

  it('createUserStory => should call the usersStoriesService to create a user story and return the updated project', async () => {
    const name = 'US3';
    const description = 'US3 Desc';
    const userId = 15;
    const projectId = 1;
    const featureId = 1;

    const projectsWithStatues = [
      {
        id: 1,
        user: { id: 15 },
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
        ],
      },
    ];

    const updatedProject = {
      id: 1,
      user: { id: 15 },
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
            {
              id: 3,
              name: 'US3',
              description: 'US3 Desc',
              tasks: [],
            },
          ],
        },
      ],
    };

    projectsService.getUserProjects.mockResolvedValue(projectsWithStatues);
    projectsService.getProjectById.mockResolvedValue(updatedProject);

    const result = await service.createUserStory(
      name,
      description,
      userId,
      projectId,
      featureId,
    );

    expect(result).toEqual(updatedProject);
    expect(projectsService.getUserProjects).toHaveBeenCalled();
    expect(projectsService.getUserProjects).toHaveBeenCalledWith(userId);
    expect(userStoriesService.createUserStory).toHaveBeenCalled();
    expect(userStoriesService.createUserStory).toHaveBeenCalledWith(
      name,
      description,
      featureId,
    );
    expect(projectsService.getProjectById).toHaveBeenCalled();
    expect(projectsService.getProjectById).toHaveBeenCalledWith(projectId);
  });

  it('createUserStory => should throw unauthorized error when feature is undefined', async () => {
    const name = 'US3';
    const description = 'US3 Desc';
    const userId = 15;
    const projectId = 1;
    const featureId = 100;

    const projectsWithStatues = [
      {
        id: 1,
        user: { id: 15 },
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
        ],
      },
    ];

    projectsService.getUserProjects.mockResolvedValue(projectsWithStatues);

    try {
      await service.createUserStory(
        name,
        description,
        userId,
        projectId,
        featureId,
      );
    } catch (error) {
      expect(error).toEqual(new UnauthorizedException('Unauthorized!'));
      expect(projectsService.getUserProjects).toHaveBeenCalled();
      expect(projectsService.getUserProjects).toHaveBeenCalledWith(userId);
    }
  });

  it('createUserStory => should throw unauthorized error when project is undefined', async () => {
    const name = 'US3';
    const description = 'US3 Desc';
    const userId = 15;
    const projectId = 900;
    const featureId = 1;

    const projectsWithStatues = [
      {
        id: 1,
        user: { id: 15 },
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
        ],
      },
    ];

    projectsService.getUserProjects.mockResolvedValue(projectsWithStatues);

    try {
      await service.createUserStory(
        name,
        description,
        userId,
        projectId,
        featureId,
      );
    } catch (error) {
      expect(error).toEqual(new UnauthorizedException('Unauthorized!'));
      expect(projectsService.getUserProjects).toHaveBeenCalled();
      expect(projectsService.getUserProjects).toHaveBeenCalledWith(userId);
    }
  });

  it('updateUserStory => should call the userStoriesService updateUserStory method and return the updated project', async () => {
    const field = 'name';
    const value = 'US1 - Edited';
    const userId = 15;
    const userStoryId = 1;

    const projectId = 2;

    const updatedProject = {
      id: 2,
      name: 'P2',
      user: { id: 15 },
      description: 'P2 description',
      status: 'To Do',
      features: [
        {
          id: 3,
          name: 'F1',
          description: 'F1 Desc',
          userStoryCount: 2,
          completedUserStories: 0,
          status: 'In Progress',
          userStories: [
            {
              id: 1,
              name: 'US1 - Edited',
              description: 'US1 Desc',
              tasksCount: 2,
              completedTasks: 0,
              tasks: [
                { id: 1, name: 'T1', status: 'To Do' },
                { id: 2, name: 'T2', status: 'In Progress' },
              ],
            },
          ],
        },
      ],
    };

    userStoriesService.updateUserStory.mockResolvedValue(projectId);
    projectsService.getProjectById.mockResolvedValue(updatedProject);

    const result = await service.updateUserStory(
      field,
      value,
      userId,
      userStoryId,
    );

    expect(result).toEqual(updatedProject);
    expect(userStoriesService.updateUserStory).toHaveBeenCalled();
    expect(userStoriesService.updateUserStory).toHaveBeenCalledWith(
      field,
      value,
      userId,
      userStoryId,
    );
    expect(projectsService.getProjectById).toHaveBeenCalled();
    expect(projectsService.getProjectById).toHaveBeenCalledWith(projectId);
  });

  it('deleteUserStory => should delete the user story and return the updated project', async () => {
    const userStoryId = 3;
    const userId = 15;

    const projectId = 1;

    const projectWithStatues = {
      id: 1,
      user: { id: 15 },
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

    userStoriesService.deleteUserStory.mockResolvedValue(projectId);
    projectsService.getProjectById.mockResolvedValue(projectWithStatues);

    const result = await service.deleteUserStory(userStoryId, userId);

    expect(result).toEqual(projectWithStatues);
    expect(userStoriesService.deleteUserStory).toHaveBeenCalled();
    expect(userStoriesService.deleteUserStory).toHaveBeenCalledWith(
      userStoryId,
      userId,
    );
    expect(projectsService.getProjectById).toHaveBeenCalled();
    expect(projectsService.getProjectById).toHaveBeenCalledWith(projectId);
  });

  it('createTask => should call the tasksService to create a task and return the updated project', async () => {
    const name = 'T3';
    const userId = 15;
    const projectId = 1;
    const featureId = 1;
    const userStoryId = 1;

    const projectsWithStatues = [
      {
        id: 1,
        user: { id: 15 },
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
                tasksCount: 0,
                completedTasks: 0,
                tasks: [],
              },
            ],
          },
        ],
      },
    ];

    const updatedProject = {
      id: 1,
      user: { id: 15 },
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
                { id: 3, name: 'T3', status: 'To Do' },
              ],
            },
            {
              id: 2,
              name: 'US2',
              description: 'US2 Desc',
              tasksCount: 0,
              completedTasks: 0,
              tasks: [],
            },
          ],
        },
      ],
    };

    projectsService.getUserProjects.mockResolvedValue(projectsWithStatues);
    projectsService.getProjectById.mockResolvedValue(updatedProject);

    const result = await service.createTask(
      name,
      userId,
      projectId,
      featureId,
      userStoryId,
    );

    expect(result).toEqual(updatedProject);
    expect(projectsService.getUserProjects).toHaveBeenCalled();
    expect(projectsService.getUserProjects).toHaveBeenCalledWith(userId);
    expect(tasksService.createTask).toHaveBeenCalled();
    expect(tasksService.createTask).toHaveBeenCalledWith(name, userStoryId);
    expect(projectsService.getProjectById).toHaveBeenCalled();
    expect(projectsService.getProjectById).toHaveBeenCalledWith(projectId);
  });

  it('createTask => should throw an error when user story is undefined', async () => {
    const name = 'T3';
    const userId = 15;
    const projectId = 1;
    const featureId = 1;
    const userStoryId = 100;

    const projectsWithStatues = [
      {
        id: 1,
        user: { id: 15 },
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
                tasksCount: 0,
                completedTasks: 0,
                tasks: [],
              },
            ],
          },
        ],
      },
    ];

    projectsService.getUserProjects.mockResolvedValue(projectsWithStatues);
    try {
      await service.createTask(name, userId, projectId, featureId, userStoryId);
    } catch (error) {
      expect(error).toEqual(new UnauthorizedException('Unauthorized!'));
      expect(projectsService.getUserProjects).toHaveBeenCalled();
      expect(projectsService.getUserProjects).toHaveBeenCalledWith(userId);
    }
  });

  it('createTask => should throw an error when feature is undefined', async () => {
    const name = 'T3';
    const userId = 15;
    const projectId = 1;
    const featureId = 100;
    const userStoryId = 1;

    const projectsWithStatues = [
      {
        id: 1,
        user: { id: 15 },
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
                tasksCount: 0,
                completedTasks: 0,
                tasks: [],
              },
            ],
          },
        ],
      },
    ];

    projectsService.getUserProjects.mockResolvedValue(projectsWithStatues);
    try {
      await service.createTask(name, userId, projectId, featureId, userStoryId);
    } catch (error) {
      expect(error).toEqual(new UnauthorizedException('Unauthorized!'));
      expect(projectsService.getUserProjects).toHaveBeenCalled();
      expect(projectsService.getUserProjects).toHaveBeenCalledWith(userId);
    }
  });

  it('createTask => should throw an error when project is undefined', async () => {
    const name = 'T3';
    const userId = 15;
    const projectId = 100;
    const featureId = 1;
    const userStoryId = 1;

    const projectsWithStatues = [
      {
        id: 1,
        user: { id: 15 },
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
                tasksCount: 0,
                completedTasks: 0,
                tasks: [],
              },
            ],
          },
        ],
      },
    ];

    projectsService.getUserProjects.mockResolvedValue(projectsWithStatues);
    try {
      await service.createTask(name, userId, projectId, featureId, userStoryId);
    } catch (error) {
      expect(error).toEqual(new UnauthorizedException('Unauthorized!'));
      expect(projectsService.getUserProjects).toHaveBeenCalled();
      expect(projectsService.getUserProjects).toHaveBeenCalledWith(userId);
    }
  });

  it('updateTask => should call the tasksService updateTask method and return the updated user story status', async () => {
    const field = 'name';
    const value = 'T1 - Edited';
    const userId = 15;
    const taskId = 1;

    const userStoryId = 1;

    const updatedUserStoryStatus = '0/3';

    tasksService.updateTask.mockResolvedValue(userStoryId);
    userStoriesService.getUserStoryStatusById.mockResolvedValue(
      updatedUserStoryStatus,
    );

    const result = await service.updateTask(field, value, userId, taskId);

    expect(result).toEqual(updatedUserStoryStatus);
    expect(tasksService.updateTask).toHaveBeenCalled();
    expect(tasksService.updateTask).toHaveBeenCalledWith(
      field,
      value,
      userId,
      taskId,
    );
    expect(userStoriesService.getUserStoryStatusById).toHaveBeenCalled();
    expect(userStoriesService.getUserStoryStatusById).toHaveBeenCalledWith(
      userStoryId,
    );
  });

  it('deleteTask => should delete the task and return the corresponding story status and its updated task list', async () => {
    const taskId = 3;
    const userId = 15;

    const userStoryId = 1;
    const storyStatus = '2/2';
    const updatedUserStory = {
      id: 1,
      name: 'US1',
      description: 'US1 Desc',
      tasks: [
        { id: 1, name: 'T1', status: 'Done!' },
        { id: 2, name: 'T2', status: 'Done!' },
      ],
    } as UserStory;

    const returnObject = {
      storyStatus,
      taskList: updatedUserStory.tasks,
    };

    tasksService.deleteTask.mockResolvedValue(userStoryId);
    userStoriesService.getUserStoryStatusById.mockResolvedValue(storyStatus);
    userStoriesService.getUserStoryById.mockResolvedValue(updatedUserStory);

    const result = await service.deleteTask(taskId, userId);

    expect(result).toEqual(returnObject);
    expect(tasksService.deleteTask).toHaveBeenCalled();
    expect(tasksService.deleteTask).toHaveBeenCalledWith(taskId, userId);
    expect(userStoriesService.getUserStoryStatusById).toHaveBeenCalled();
    expect(userStoriesService.getUserStoryStatusById).toHaveBeenCalledWith(
      userStoryId,
    );
    expect(userStoriesService.getUserStoryById).toHaveBeenCalled();
    expect(userStoriesService.getUserStoryById).toHaveBeenCalledWith(
      userStoryId,
    );
  });
});
