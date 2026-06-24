import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dish } from '../../entities/dish.entity';
import { Recipe } from '../../entities/recipe.entity';
import { Restaurant } from '../../entities/restaurant.entity';
import { HealthProfile } from '../../entities/health-profile.entity';
import { RecommendationService } from './recommendation.service';
import { RecommendationController } from './recommendation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Dish, Recipe, Restaurant, HealthProfile])],
  controllers: [RecommendationController],
  providers: [RecommendationService],
  exports: [RecommendationService],
})
export class RecommendationModule {}