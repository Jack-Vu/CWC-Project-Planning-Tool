import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SignUpDto } from 'src/auth/auth.controller';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository = {
    findOneBy: jest.fn(),
    findUserById: jest.fn(),
    findUserByUsername: jest.fn(),
    findUserByEmail: jest.fn(),
    createUser: jest.fn(),
    deleteUser: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findUserById => should find an existing user by their id', async () => {
    const id = 1;
    const user = {
      id: 1,
      name: 'test',
      email: 'test@test.com',
      username: 'test',
      password: 'fake-password',
    } as User;

    jest.spyOn(mockUserRepository, 'findOneBy').mockReturnValue(user);

    const result = await service.findUserById(id);

    expect(result).toEqual(user);
    expect(mockUserRepository.findOneBy).toHaveBeenCalled();
    expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id });
  });

  it('findUserByUsername => should find an existing user by their username', async () => {
    const username = 'test';
    const user = {
      id: 1,
      name: 'test',
      email: 'test@test.com',
      username: 'test',
      password: 'fake-password',
    } as User;

    jest.spyOn(mockUserRepository, 'findOneBy').mockReturnValue(user);

    const result = await service.findUserByUsername(username);

    expect(result).toEqual(user);
    expect(mockUserRepository.findOneBy).toHaveBeenCalled();
    expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ username });
  });

  it('findUserByEmail => should find an existing user by their email', async () => {
    const email = 'test@test.com';
    const user = {
      id: 1,
      name: 'test',
      email: 'test@test.com',
      username: 'test',
      password: 'fake-password',
    } as User;

    jest.spyOn(mockUserRepository, 'findOneBy').mockReturnValue(user);

    const result = await service.findUserByEmail(email);

    expect(result).toEqual(user);
    expect(mockUserRepository.findOneBy).toHaveBeenCalled();
    expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ email });
  });

  it('createUser => should return the user object that is passed within the method with an id property', async () => {
    const signUpDto = {
      name: 'test',
      email: 'test@test.com',
      username: 'test',
      password: 'test-fake-password',
    } as SignUpDto;
    const user = {
      id: 1,
      name: 'test',
      email: 'test@test.com',
      username: 'test',
      password: 'test-fake-password',
    };

    jest.spyOn(mockUserRepository, 'save').mockReturnValue(user);
    const result = await service.createUser(signUpDto);

    expect(result).toEqual(user);
    expect(mockUserRepository.save).toHaveBeenCalled();
    expect(mockUserRepository.save).toHaveBeenCalledWith(signUpDto);
  });

  it('deleteUser => should return the user object that corresponds to the id passed in', async () => {
    const id = 1;
    const user = {
      id: 1,
      name: 'test',
      email: 'test@test.com',
      username: 'test',
      password: 'test-fake-password',
    };

    jest.spyOn(mockUserRepository, 'delete').mockReturnValue(user);
    const result = await service.deleteUser(id);

    expect(result).toEqual(user);
    expect(mockUserRepository.delete).toHaveBeenCalled();
    expect(mockUserRepository.delete).toHaveBeenCalledWith(id);
  });
});
