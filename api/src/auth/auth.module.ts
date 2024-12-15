import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/mail/mail.module';
import { ProjectsModule } from 'src/projects/projects.module';
import { FeaturesModule } from 'src/features/features.module';
import { UserStoriesModule } from 'src/userStories/userStories.module';
import { TasksModule } from 'src/tasks/tasks.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UsersModule,
    ProjectsModule,
    FeaturesModule,
    UserStoriesModule,
    TasksModule,
    MailModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '5s' },
    }),
  ],
})
export class AuthModule {}
