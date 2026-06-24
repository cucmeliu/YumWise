import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthProfile } from '../../entities/health-profile.entity';
import { HealthProfileService } from './health-profile.service';
import { HealthProfileController } from './health-profile.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HealthProfile])],
  controllers: [HealthProfileController],
  providers: [HealthProfileService],
  exports: [HealthProfileService],
})
export class HealthProfileModule {}