import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FeaturesService } from './features.service';
import { Feature } from './entities/feature.entity';
import { BadRequestException } from '@nestjs/common';

describe('FeaturesService', () => {
  let service: FeaturesService;

  const mockFeaturesRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeaturesService,
        {
          provide: getRepositoryToken(Feature),
          useValue: mockFeaturesRepository,
        },
      ],
    }).compile();

    service = module.get<FeaturesService>(FeaturesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("getProjectFeatures => should return a project's features and those feature's user stories based on passed in project id", async () => {
    const projectId = 1;
    const features = [
      { id: 1, name: 'F1', description: '', userStories: [] },
      { id: 2, name: 'F2', description: '', userStories: [] },
      { id: 3, name: 'F3', description: '', userStories: [] },
    ] as Feature[];

    jest.spyOn(mockFeaturesRepository, 'find').mockReturnValue(features);

    const result = await service.getProjectFeatures(projectId);

    expect(result).toEqual(features);
    expect(mockFeaturesRepository.find).toHaveBeenCalled();
    expect(mockFeaturesRepository.find).toHaveBeenCalledWith({
      where: { project: { id: projectId } },
      relations: ['userStories'],
    });
  });

  it("createFeature => should add a feature to a project and return a list of that project's features", async () => {
    const name = 'F4';
    const description = '';
    const projectId = 1;

    const savedFeature = {
      id: 4,
      name: 'F4',
      description: '',
      userStories: [],
    } as Feature;

    const features = [
      { id: 1, name: 'F1', description: '', userStories: [] },
      { id: 2, name: 'F2', description: '', userStories: [] },
      { id: 3, name: 'F3', description: '', userStories: [] },
      { id: 4, name: 'F4', description: '', userStories: [] },
    ] as Feature[];

    jest.spyOn(mockFeaturesRepository, 'save').mockReturnValue(savedFeature);
    jest.spyOn(mockFeaturesRepository, 'find').mockReturnValue(features);

    const result = await service.createFeature(name, description, projectId);

    expect(result).toEqual(features);
    expect(mockFeaturesRepository.save).toHaveBeenCalled();
    expect(mockFeaturesRepository.save).toHaveBeenCalledWith({
      name,
      description,
      project: {
        id: projectId,
      },
    });
    expect(mockFeaturesRepository.find).toHaveBeenCalled();
    expect(mockFeaturesRepository.find).toHaveBeenCalledWith({
      where: { project: { id: projectId } },
      relations: ['userStories'],
    });
  });

  it('updateFeature => updates a feature name and returns associated project id', async () => {
    const field = 'name';
    const value = 'F4 - Edited';
    const userId = 15;
    const featureId = 4;

    const featureToUpdate = {
      id: 4,
      name: 'F4',
      description: '',
      project: {
        id: 2,
      },
    } as Feature;

    const updatedFeature = {
      id: 4,
      name: 'F4 - Edited',
      description: '',
      project: {
        id: 2,
      },
    } as Feature;

    jest
      .spyOn(mockFeaturesRepository, 'findOne')
      .mockReturnValue(featureToUpdate);
    jest.spyOn(mockFeaturesRepository, 'save').mockReturnValue(updatedFeature);

    const result = await service.updateFeature(field, value, userId, featureId);

    expect(result).toEqual(updatedFeature.project.id);
    expect(mockFeaturesRepository.findOne).toHaveBeenCalled();
    expect(mockFeaturesRepository.findOne).toHaveBeenCalledWith({
      where: {
        id: featureId,
        project: { user: { id: userId } },
      },
      relations: ['project'],
    });
    expect(mockFeaturesRepository.save).toHaveBeenCalled();
    expect(mockFeaturesRepository.save).toHaveBeenCalledWith(updatedFeature);
  });

  it('updateFeature => updates a feature description and returns associated project id', async () => {
    const field = 'description';
    const value = 'F4 description added';
    const userId = 15;
    const featureId = 4;

    const featureToUpdate = {
      id: 4,
      name: 'F4',
      description: '',
      project: {
        id: 2,
      },
    } as Feature;

    const updatedFeature = {
      id: 4,
      name: 'F4',
      description: 'F4 description added',
      project: {
        id: 2,
      },
    } as Feature;

    jest
      .spyOn(mockFeaturesRepository, 'findOne')
      .mockReturnValue(featureToUpdate);
    jest.spyOn(mockFeaturesRepository, 'save').mockReturnValue(updatedFeature);

    const result = await service.updateFeature(field, value, userId, featureId);

    expect(result).toEqual(updatedFeature.project.id);
    expect(mockFeaturesRepository.findOne).toHaveBeenCalled();
    expect(mockFeaturesRepository.findOne).toHaveBeenCalledWith({
      where: {
        id: featureId,
        project: { user: { id: userId } },
      },
      relations: ['project'],
    });
    expect(mockFeaturesRepository.save).toHaveBeenCalled();
    expect(mockFeaturesRepository.save).toHaveBeenCalledWith(updatedFeature);
  });

  it('updateFeature => throws error when feature is not found', async () => {
    const field = 'description';
    const value = 'F4 description added';
    const userId = 16;
    const featureId = 14;

    jest.spyOn(mockFeaturesRepository, 'findOne').mockReturnValue(undefined);

    expect(async () => {
      await service.updateFeature(field, value, userId, featureId);
    }).rejects.toThrow(BadRequestException);
    expect(mockFeaturesRepository.findOne).toHaveBeenCalled();
    expect(mockFeaturesRepository.findOne).toHaveBeenCalledWith({
      where: {
        id: featureId,
        project: { user: { id: userId } },
      },
      relations: ['project'],
    });
  });

  it('deleteFeature => deletes feature found by the passed in id and returns the associated project id', async () => {
    const featureId = 21;
    const userId = 13;

    const feature = {
      id: 1,
      name: 'Feature Delete',
      description: '',
      userStories: [],
      project: {
        id: 2,
      },
    } as Feature;
    const deletedResult = {
      raw: [],
      affected: 1,
    };

    jest.spyOn(mockFeaturesRepository, 'findOne').mockReturnValue(feature);
    jest.spyOn(mockFeaturesRepository, 'delete').mockReturnValue(deletedResult);

    const result = await service.deleteFeature(featureId, userId);

    expect(result).toEqual(feature.project.id);
    expect(mockFeaturesRepository.findOne).toHaveBeenCalled();
    expect(mockFeaturesRepository.findOne).toHaveBeenCalledWith({
      where: { id: featureId, project: { user: { id: userId } } },
      relations: ['project'],
    });
    expect(mockFeaturesRepository.delete).toHaveBeenCalled();
    expect(mockFeaturesRepository.delete).toHaveBeenCalledWith(feature);
  });

  it('deleteFeature => throws error when feature is not found', async () => {
    const featureId = 11;
    const userId = 13;

    jest.spyOn(mockFeaturesRepository, 'findOne').mockReturnValue(undefined);

    expect(async () => {
      await service.deleteFeature(featureId, userId);
    }).rejects.toThrow(BadRequestException);
    expect(mockFeaturesRepository.findOne).toHaveBeenCalled();
    expect(mockFeaturesRepository.findOne).toHaveBeenCalledWith({
      where: { id: featureId, project: { user: { id: userId } } },
      relations: ['project'],
    });
  });
});
