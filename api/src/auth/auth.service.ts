import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async hashPassword(password: string) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async signUp(signUpDto) {
    //check if username exist
    //check if email exist

    const hashedPassword = await this.hashPassword(signUpDto.password);
    signUpDto.password = hashedPassword
    this.usersService.createUser(signUpDto);
    return 'Fake token';
  }
}
