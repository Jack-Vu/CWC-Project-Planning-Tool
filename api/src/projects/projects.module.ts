import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';

@Module({
  providers: [ProjectsService],
  exports: [ProjectsService],
  imports: [TypeOrmModule.forFeature([Project])],
})
export class ProjectsModule {}
