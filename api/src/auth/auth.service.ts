import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  AccountDetailDto,
  Email,
  LogInDto,
  SignUpDto,
} from './auth.controller';
import { User } from '../users/entities/user.entity';
import { MailService } from '../mail/mail.service';
import { ProjectsService } from '../projects/projects.service';
import { FeaturesService } from '../features/features.service';
import { UserStoriesService } from '../userStories/userStories.service';
import { TasksService } from '../tasks/tasks.service';

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

  async verifyUniqueUsername(username: string) {
    const user = await this.usersService.findUserByUsername(username);
    if (!user?.username) {
      return true;
    } else {
      return false;
    }
  }

  async verifyUniqueEmail(email: string) {
    const user = await this.usersService.findUserByEmail(email);
    if (!user?.email) {
      return true;
    } else {
      return false;
    }
  }

  async signUp(signUpDto: SignUpDto) {
    const isUniqueUsername = await this.verifyUniqueUsername(
      signUpDto.username,
    );

    if (!isUniqueUsername) {
      throw new BadRequestException('Bad Request!');
    }

    const isUniqueEmail = await this.verifyUniqueEmail(signUpDto.email);

    if (!isUniqueEmail) {
      throw new BadRequestException('Bad Request!');
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
      throw new UnauthorizedException('Unauthorized!');
    }
    const passwordsMatch = await this.verifyPassword(
      logInDto.password,
      user.password,
    );
    if (!passwordsMatch) {
      throw new UnauthorizedException('Unauthorized!');
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
    } else if (accountDetailDto.field === 'username') {
      const isUniqueUsername = await this.verifyUniqueUsername(
        accountDetailDto.value,
      );
      if (!isUniqueUsername) {
        throw new BadRequestException('Bad request!');
      }
      user[accountDetailDto.field] = accountDetailDto.value;
    } else if (accountDetailDto.field === 'email') {
      const isUniqueEmail = await this.verifyUniqueEmail(
        accountDetailDto.value,
      );
      if (!isUniqueEmail) {
        throw new BadRequestException('Bad request!');
      }
      user[accountDetailDto.field] = accountDetailDto.value;
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

    try {
      await this.jwtService.verifyAsync(token, {
        secret: user.password,
      });

      const hashedNewPassword = await this.hashPassword(newPassword);
      user.password = hashedNewPassword;
      const updatedUser = await this.usersService.createUser(user);
      return {
        email: updatedUser.email,
        name: updatedUser.name,
        username: updatedUser.username,
      };
    } catch {
      throw new UnauthorizedException('token is invalid');
    }
  }

  async deleteUser(id: number) {
    return await this.usersService.deleteUser(id);
  }

  async getUserProjects(userId: number) {
    return this.projectsService.getUserProjects(userId);
  }

  async getProjectById(projectId: number, userId: number) {
    const projects = await this.projectsService.getUserProjects(userId);
    return projects.filter((project) => project.id === projectId)[0];
  }

  async createProject(name: string, description: string, userId: number) {
    return await this.projectsService.createProject(name, description, userId);
  }

  async updateProject(
    field: string,
    value: string,
    userId: number,
    projectId: number,
  ) {
    return await this.projectsService.updateProject(
      field,
      value,
      userId,
      projectId,
    );
  }

  async deleteProject(projectId: number, userId: number) {
    return await this.projectsService.deleteProject(projectId, userId);
  }

  async createFeature(
    name: string,
    description: string,
    userId: number,
    projectId: number,
  ) {
    const projects = await this.projectsService.getUserProjects(userId);
    const project = projects.find((project) => project.id === projectId);

    if (project) {
      await this.featuresService.createFeature(name, description, projectId);
      return await this.projectsService.getProjectById(projectId);
    } else {
      throw new UnauthorizedException('Unauthorized!');
    }
  }

  async updateFeature(
    field: string,
    value: string,
    userId: number,
    featureId: number,
  ) {
    const projectId = await this.featuresService.updateFeature(
      field,
      value,
      userId,
      featureId,
    );
    return await this.projectsService.getProjectById(projectId);
  }

  async deleteFeature(featureId: number, userId: number) {
    const projectId = await this.featuresService.deleteFeature(
      featureId,
      userId,
    );
    return await this.projectsService.getProjectById(projectId);
  }

  async createUserStory(
    name: string,
    description: string,
    userId: number,
    projectId: number,
    featureId: number,
  ) {
    const projects = await this.projectsService.getUserProjects(userId);
    console.log(projects);

    console.log(
      projects.find((project) => projectId === project.id),
      projectId,
    );

    const project = projects.find((project) => project.id === projectId);
    if (project) {
      const features = project.features;
      const feature = features.find((feature) => feature.id === featureId);

      if (feature) {
        await this.userStoriesService.createUserStory(
          name,
          description,
          feature.id,
        );
        return this.projectsService.getProjectById(projectId);
      } else {
        throw new UnauthorizedException('Unauthorized!');
      }
    } else {
      throw new UnauthorizedException('Unauthorized!');
    }
  }

  async updateUserStory(
    field: string,
    value: string,
    userId: number,
    userStoryId: number,
  ) {
    const projectId = await this.userStoriesService.updateUserStory(
      field,
      value,
      userId,
      userStoryId,
    );
    return await this.projectsService.getProjectById(projectId);
  }

  async deleteUserStory(userStoryId: number, userId: number) {
    const projectId = await this.userStoriesService.deleteUserStory(
      userStoryId,
      userId,
    );
    return await this.projectsService.getProjectById(projectId);
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
    if (project) {
      const features = project.features;
      const feature = features.find((feature) => feature.id === featureId);
      if (feature) {
        const userStories = feature.userStories;

        const userStory = userStories.find(
          (userStory) => (userStory.id = userStoryId),
        );
        if (userStory) {
          await this.tasksService.createTask(name, userStoryId);
          return await this.projectsService.getProjectById(projectId);
        } else {
          throw new UnauthorizedException('Unauthorized!');
        }
      } else {
        throw new UnauthorizedException('Unauthorized!');
      }
    } else {
      throw new UnauthorizedException('Unauthorized!');
    }
  }

  async updateTask(
    field: string,
    value: string,
    userId: number,
    taskId: number,
  ) {
    const userStoryId = await this.tasksService.updateTask(
      field,
      value,
      userId,
      taskId,
    );
    return await this.userStoriesService.getUserStoryStatusById(userStoryId);
  }

  async deleteTask(taskId: number, userId: number) {
    const userStoryId = await this.tasksService.deleteTask(taskId, userId);
    const storyStatus =
      await this.userStoriesService.getUserStoryStatusById(userStoryId);
    const updatedUserStory =
      await this.userStoriesService.getUserStoryById(userStoryId);
    return {
      storyStatus,
      taskList: updatedUserStory.tasks,
    };
  }
}
