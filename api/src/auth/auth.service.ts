import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  AccountDetailDto,
  Email,
  LogInDto,
  SignUpDto,
} from './auth.controller';
import { User } from 'src/users/entities/user.entity';
import { MailService } from 'src/mail/mail.service';
import { ProjectsService } from 'src/projects/projects.service';
import { FeaturesService } from 'src/features/features.service';
import { UserStoriesService } from 'src/userStories/userStories.service';
import { TasksService } from 'src/tasks/tasks.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private projectsService: ProjectsService,
    private featuresService: FeaturesService,
    private userStoriesService: UserStoriesService,
    private tasksService: TasksService,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async createAccessToken(user: User, secret?: string) {
    const payload = { sub: user.id };
    if (secret) {
      return await this.jwtService.signAsync(payload, {
        secret,
        expiresIn: '10m',
      });
    } else {
      return await this.jwtService.signAsync(payload);
    }
  }

  async signUp(signUpDto: SignUpDto) {
    const usernameExists = (
      await this.usersService.findUserByUsername(signUpDto.username)
    )?.username;
    const emailExists = (
      await this.usersService.findUserByEmail(signUpDto.email)
    )?.email;
    if (usernameExists) {
      // TODO remove comment only use for testing

      throw new BadRequestException('Username already exists!');
    }
    if (emailExists) {
      // TODO remove comment only use for testing

      throw new BadRequestException('Email already exists!');
    }
    const hashedPassword = await this.hashPassword(signUpDto.password);
    signUpDto.password = hashedPassword;
    const user = await this.usersService.createUser(signUpDto);
    return await this.createAccessToken(user);
  }

  async verifyPassword(enteredPassword: string, existingPassword: string) {
    return bcrypt.compare(enteredPassword, existingPassword);
  }

  async logIn(logInDto: LogInDto) {
    const user = await this.usersService.findUserByUsername(logInDto.username);
    if (!user) {
      // TODO remove comment only use for testing
      throw new UnauthorizedException("user doesn't exist");
    }
    const passwordsMatch = await this.verifyPassword(
      logInDto.password,
      user.password,
    );
    if (!passwordsMatch) {
      // TODO remove comment only use for testing
      throw new UnauthorizedException('incorrect password');
    }

    return await this.createAccessToken(user);
  }
  async changeAccountDetail(accountDetailDto: AccountDetailDto) {
    const user = await this.usersService.findUserByUsername(
      accountDetailDto.username,
    );
    if (accountDetailDto.field === 'password') {
      const plainTextPassword = accountDetailDto.value;
      const hashedPassword = await this.hashPassword(plainTextPassword);
      user[accountDetailDto.field] = hashedPassword;
    } else {
      user[accountDetailDto.field] = accountDetailDto.value;
    }
    const updatedUser = await this.usersService.createUser(user);
    return {
      name: updatedUser.name,
      email: updatedUser.email,
      username: updatedUser.username,
    };
  }

  async getProfileData(id: number) {
    const user = await this.usersService.findUserById(id);

    return {
      email: user.email,
      name: user.name,
      username: user.username,
    };
  }

  async sendResetPasswordEmail(email: Email) {
    const user = await this.usersService.findUserByEmail(email.email);
    if (!user) {
      throw new BadRequestException('email not found');
    }
    const token = await this.createAccessToken(user, user.password);

    return await this.mailService.sendPasswordResetEmail(user, token);
  }

  async saveNewPassword(newPassword: string, id: number, token: string) {
    const user = await this.usersService.findUserById(id);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const payload = await this.jwtService
      .verifyAsync(token, {
        secret: user.password,
      })
      .catch(() => {
        throw new UnauthorizedException('token is invalid');
      })
      .then(async () => {
        const hashedNewPassword = await this.hashPassword(newPassword);
        user.password = hashedNewPassword;
        return await this.usersService.createUser(user);
      });
  }

  async deleteUser(id: number) {
    return await this.usersService.deleteUser(id);
  }

  async getUserProjects(userId: number) {
    return this.projectsService.getUserProjects(userId);
  }

  async createProject(name: string, description: string, userId: number) {
    return await this.projectsService.createProject(name, description, userId);
  }

  async getProjectById(projectId: number, userId: number) {
    const projects = await this.projectsService.getUserProjects(userId);
    return projects.filter((project) => project.id === projectId)[0];
  }

  async createFeature(
    name: string,
    description: string,
    userId: number,
    projectId: number,
  ) {
    const project = (await this.projectsService.getUserProjects(userId)).find(
      (project) => {
        return project.id === projectId;
      },
    );
    if (project.id) {
      return await this.featuresService.createFeature(
        name,
        description,
        project.id,
      );
    } else {
      throw new UnauthorizedException('project not found');
    }
  }
  async createUserStory(
    name: string,
    description: string,
    userId: number,
    projectId: number,
    featureId: number,
  ) {
    const projects = await this.projectsService.getUserProjects(userId);
    const project = projects.find((project) => project.id === projectId);
    const features = project.features;
    const feature = features.find((feature) => feature.id === featureId);

    if (feature.id) {
      return await this.userStoriesService.createUserStory(
        name,
        description,
        feature.id,
      );
    } else {
      throw new UnauthorizedException('feature not found');
    }
  }

  async createTask(
    name: string,
    userId: number,
    projectId: number,
    featureId: number,
    userStoryId: number,
  ) {
    const projects = await this.projectsService.getUserProjects(userId);
    const project = projects.find((project) => project.id === projectId);
    const features = project.features;
    const feature = features.find((feature) => feature.id === featureId);
    const userStories = feature.userStories;

    const userStory = userStories.find(
      (userStory) => (userStory.id = userStoryId),
    );
    if (userStory.id) {
      return await this.tasksService.createTask(name, userStoryId);
    } else {
      throw new UnauthorizedException('user story not found');
    }
  }
}
