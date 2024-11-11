import { BadRequestException, Injectable } from '@nestjs/common';
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
    return await this.featuresRepository.find({
      where: { project: { id } },
      relations: ['userStories'],
    });
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

  async updateFeature(
    field: string,
    value: string,
    userId: number,
    featureId: number,
  ) {
    const featureToUpdate = await this.featuresRepository.findOne({
      where: {
        id: featureId,
        project: { user: { id: userId } },
      },
      relations: ['project'],
    });

    if (featureToUpdate) {
      featureToUpdate[field] = value;
      const updatedFeature = await this.featuresRepository.save(featureToUpdate);

      return updatedFeature.project.id;
    } else {
      throw new BadRequestException('You cannot edit that feature');
    }
  }
}
