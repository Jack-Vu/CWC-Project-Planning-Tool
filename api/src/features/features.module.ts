import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feature } from './entities/feature.entity';
import { FeaturesService } from './features.service';

@Module({
  providers: [FeaturesService],
  exports: [FeaturesService],
  imports: [TypeOrmModule.forFeature([Feature])],
})
export class FeaturesModule {}
