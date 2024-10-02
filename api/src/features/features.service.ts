import { Injectable } from '@nestjs/common';
import { Feature } from './entities/feature.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FeaturesService {
  constructor(
    @InjectRepository(Feature)
    private featuresRepository: Repository<Feature>,
  ) {}

  async getProjectFeatures(id: number) {
    return await this.featuresRepository.find({ where: { project: { id } } });
  }

  async createFeature(name: string, description: string, projectId: number) {
    await this.featuresRepository.save({
      name,
      description,
      project: {
        id: projectId,
      },
    });
    return await this.getProjectFeatures(projectId);
  }
}
