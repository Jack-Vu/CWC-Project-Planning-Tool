import { Injectable } from '@nestjs/common';
import { Name } from './name.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Name)
    private nameRepository: Repository<Name>,
  ) {}

  async addName(firstName: string, lastName: string) {
    await this.nameRepository.save({
      first_name: firstName,
      last_name: lastName,
    });
    return await this.getNames();
  }

  async getNames() {
    return await this.nameRepository.find();
  }
}
