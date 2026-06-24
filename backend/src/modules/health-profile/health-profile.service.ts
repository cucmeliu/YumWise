import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { HealthProfile } from '../../entities/health-profile.entity';

@Injectable()
export class HealthProfileService {
  constructor(
    @InjectRepository(HealthProfile)
    private profileRepository: Repository<HealthProfile>,
  ) {}

  async findByUserId(userId: string): Promise<HealthProfile | null> {
    return this.profileRepository.findOne({ where: { userId } });
  }

  async createOrUpdate(userId: string, profileData: Partial<HealthProfile>): Promise<HealthProfile> {
    let profile = await this.findByUserId(userId);

    if (profileData.height && profileData.weight) {
      profileData.bmi = Number((profileData.weight / Math.pow(profileData.height / 100, 2)).toFixed(2));
    }

    if (profileData.healthGoal && profileData.weight && profileData.height) {
      profileData.dailyCalories = this.calculateDailyCalories(
        profileData.healthGoal,
        profileData.weight,
        profileData.height,
        profileData.age || 30,
      );
    }

    if (!profile) {
      profile = this.profileRepository.create({
        id: uuidv4(),
        userId,
        ...profileData,
      });
    } else {
      Object.assign(profile, profileData);
    }

    return this.profileRepository.save(profile);
  }

  private calculateDailyCalories(
    healthGoal: string,
    weight: number,
    height: number,
    age: number,
  ): number {
    const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    const tdee = bmr * 1.55;

    switch (healthGoal) {
      case 'weight_loss':
        return Math.round(tdee * 0.8);
      case 'muscle_gain':
        return Math.round(tdee * 1.15);
      case 'pregnancy':
        return Math.round(tdee + 300);
      case 'sugar_control':
        return Math.round(tdee * 0.9);
      default:
        return Math.round(tdee);
    }
  }
}