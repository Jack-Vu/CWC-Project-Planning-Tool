import { Injectable } from '@nestjs/common';
import { SignUpDto } from 'src/auth/auth.controller';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async createUser(user: SignUpDto) {
    console.log(user);
    return await this.usersRepository.save({ ...user });
  }
}
