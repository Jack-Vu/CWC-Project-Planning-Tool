import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import * as sanitizeHtml from 'sanitize-html';
import { AuthGuard } from './auth.guard';

export class SignUpDto {
  @IsNotEmpty()
  @Transform((params) => sanitizeHtml(params.value))
  name: string;

  @IsEmail()
  @Transform((params) => sanitizeHtml(params.value))
  email: string;

  @IsNotEmpty()
  @Transform((params) => sanitizeHtml(params.value))
  username: string;

  @IsNotEmpty()
  @Transform((params) => sanitizeHtml(params.value))
  password: string;
}

export class LogInDto {
  @IsNotEmpty()
  @Transform((params) => sanitizeHtml(params.value))
  username: string;

  @IsNotEmpty()
  @Transform((params) => sanitizeHtml(params.value))
  password: string;
}

export class AccountDetailDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  field: string;

  @IsNotEmpty()
  @Transform((params) => sanitizeHtml(params.value))
  value: string;
}

export class ProjectDto {
  @IsNotEmpty()
  @Transform((params) => sanitizeHtml(params.value))
  name: string;

  @IsOptional()
  @Transform((params) => sanitizeHtml(params.value))
  description: string;
}
export class FeatureDto {
  @IsNotEmpty()
  @Transform((params) => sanitizeHtml(params.value))
  name: string;

  @IsOptional()
  @Transform((params) => sanitizeHtml(params.value))
  description: string;

  @IsNotEmpty()
  projectId: number;
}
export class UserStoryDto {
  @IsNotEmpty()
  @Transform((params) => sanitizeHtml(params.value))
  name: string;

  @IsOptional()
  @Transform((params) => sanitizeHtml(params.value))
  description: string;

  @IsNotEmpty()
  projectId: number;

  @IsNotEmpty()
  featureId: number;
}
export class TaskDto {
  @IsNotEmpty()
  @Transform((params) => sanitizeHtml(params.value))
  name: string;

  @IsNotEmpty()
  projectId: number;

  @IsNotEmpty()
  featureId: number;

  @IsNotEmpty()
  userStoryId: number;
}

export class UpdateTaskDto {
  @IsNotEmpty()
  field: string;

  @IsNotEmpty()
  @Transform((params) => sanitizeHtml(params.value))
  value: string;

  @IsNotEmpty()
  taskId: number;
}

export class UpdateUserStoryDto {
  @IsNotEmpty()
  field: string;

  @IsNotEmpty()
  @Transform((params) => sanitizeHtml(params.value))
  value: string;

  @IsNotEmpty()
  userStoryId: number;
}

export class UpdateFeatureDto {
  @IsNotEmpty()
  field: string;

  @IsNotEmpty()
  @Transform((params) => sanitizeHtml(params.value))
  value: string;

  @IsNotEmpty()
  featureId: number;
}

export class UpdateProjectDto {
  @IsNotEmpty()
  field: string;

  @IsNotEmpty()
  @Transform((params) => sanitizeHtml(params.value))
  value: string;

  @IsNotEmpty()
  projectId: number;
}

export class Email {
  @IsEmail(undefined, { message: 'Please enter a valid email address!' })
  @Transform((params) => sanitizeHtml(params.value))
  email: string;
}

export class NewPasswordDto {
  @IsNotEmpty()
  @Transform((params) => sanitizeHtml(params.value))
  newPassword: string;

  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  token: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }
  @Post('log-in')
  logIn(@Body() logInDto: LogInDto) {
    return this.authService.logIn(logInDto);
  }

  @UseGuards(AuthGuard)
  @Post('change-account-detail')
  changeAccountDetail(@Body() accountDetailDto: AccountDetailDto) {
    return this.authService.changeAccountDetail(accountDetailDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfileData(@Request() req) {
    return this.authService.getProfileData(req.user.sub);
  }

  @Post('reset-password')
  sendResetPasswordEmail(@Body() email: Email) {
    return this.authService.sendResetPasswordEmail(email);
  }

  @Post('save-new-password')
  saveNewPassword(@Body() body: NewPasswordDto) {
    return this.authService.saveNewPassword(
      body.newPassword,
      body.id,
      body.token,
    );
  }

  @UseGuards(AuthGuard)
  @Post('delete-user')
  deleteUser(@Request() req) {
    return this.authService.deleteUser(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get('user-projects')
  async getUserProjects(@Request() req) {
    const user = await this.authService.getProfileData(req.user.sub);
    const projects = await this.authService.getUserProjects(req.user.sub);
    return {
      user,
      projects,
    };
  }

  @UseGuards(AuthGuard)
  @Post('create-project')
  createProject(@Body() projectDto: ProjectDto, @Request() req) {
    return this.authService.createProject(
      projectDto.name,
      projectDto.description,
      req.user.sub,
    );
  }

  @UseGuards(AuthGuard)
  @Get('project/:id')
  getProjectById(@Param('id') id: number, @Request() req) {
    return this.authService.getProjectById(id, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Post('create-feature')
  createFeature(@Body() featureDto: FeatureDto, @Request() req) {
    return this.authService.createFeature(
      featureDto.name,
      featureDto.description,
      req.user.sub,
      featureDto.projectId,
    );
  }
  @UseGuards(AuthGuard)
  @Post('create-user-story')
  createUserStory(@Body() userStoryDto: UserStoryDto, @Request() req) {
    return this.authService.createUserStory(
      userStoryDto.name,
      userStoryDto.description,
      req.user.sub,
      userStoryDto.projectId,
      userStoryDto.featureId,
    );
  }

  @UseGuards(AuthGuard)
  @Post('create-task')
  createTask(@Body() taskDto: TaskDto, @Request() req) {
    return this.authService.createTask(
      taskDto.name,
      req.user.sub,
      taskDto.projectId,
      taskDto.featureId,
      taskDto.userStoryId,
    );
  }

  @UseGuards(AuthGuard)
  @Post('update-task')
  updateTask(@Body() updateTaskDto: UpdateTaskDto, @Request() req) {
    return this.authService.updateTask(
      updateTaskDto.field,
      updateTaskDto.value,
      req.user.sub,
      updateTaskDto.taskId,
    );
  }
  @UseGuards(AuthGuard)
  @Post('update-user-story')
  updateUserStory(
    @Body() updateUserStoryDto: UpdateUserStoryDto,
    @Request() req,
  ) {
    return this.authService.updateUserStory(
      updateUserStoryDto.field,
      updateUserStoryDto.value,
      req.user.sub,
      updateUserStoryDto.userStoryId,
    );
  }

  @UseGuards(AuthGuard)
  @Post('update-feature')
  updateFeature(@Body() updateFeatureDto: UpdateFeatureDto, @Request() req) {
    return this.authService.updateFeature(
      updateFeatureDto.field,
      updateFeatureDto.value,
      req.user.sub,
      updateFeatureDto.featureId,
    );
  }
  @UseGuards(AuthGuard)
  @Post('update-project')
  updateProject(@Body() updateProjectDto: UpdateProjectDto, @Request() req) {
    return this.authService.updateProject(
      updateProjectDto.field,
      updateProjectDto.value,
      req.user.sub,
      updateProjectDto.projectId,
    );
  }

  @UseGuards(AuthGuard)
  @Post('delete-task')
  deleteTask(@Body('taskId') taskId: number, @Request() req) {
    return this.authService.deleteTask(taskId, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Post('delete-user-story')
  deleteUserStory(@Body('userStoryId') userStoryId: number, @Request() req) {
    return this.authService.deleteUserStory(userStoryId, req.user.sub);
  }
  @UseGuards(AuthGuard)
  @Post('delete-feature')
  deleteFeature(@Body('featureId') featureId: number, @Request() req) {
    return this.authService.deleteFeature(featureId, req.user.sub);
  }
}
