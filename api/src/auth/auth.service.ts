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

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
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
    // create jwt with user current hashed password
    const token = await this.createAccessToken(user, user.password);
    // send an email to the user with a link to a reset password page on the frontend with the JWT and userID as the params

    console.log(token);
    return await this.mailService.sendPasswordResetEmail(user, token);
  }
}
