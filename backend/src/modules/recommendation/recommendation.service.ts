import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Dish } from '../../entities/dish.entity';
import { Recipe } from '../../entities/recipe.entity';
import { Restaurant } from '../../entities/restaurant.entity';
import { HealthProfile } from '../../entities/health-profile.entity';

@Injectable()
export class RecommendationService {
  constructor(
    @InjectRepository(Dish)
    private dishRepository: Repository<Dish>,
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    @InjectRepository(HealthProfile)
    private profileRepository: Repository<HealthProfile>,
  ) {}

  async getHomeRecommendations(userId: string, limit: number = 5) {
    const profile = await this.profileRepository.findOne({
      where: { userId },
    });

    const [dishes, recipes] = await Promise.all([
      this.getDishRecommendations(profile, limit),
      this.getRecipeRecommendations(profile, limit),
    ]);

    const recommendations = [...dishes, ...recipes]
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
      .slice(0, limit);

    return recommendations;
  }

  async getDishRecommendations(
    profile: HealthProfile | null,
    limit: number = 10,
  ): Promise<any[]> {
    let query = this.dishRepository
      .createQueryBuilder('dish')
      .leftJoinAndSelect('dish.restaurant', 'restaurant')
      .where('dish.status = 1')
      .andWhere('restaurant.status = 1');

    if (profile?.dailyCalories) {
      const maxCalories = Math.round(profile.dailyCalories / 3);
      query = query.andWhere('dish.calories <= :maxCalories', {
        maxCalories: maxCalories * 1.2,
      });
    }

    const dishes = await query
      .orderBy('dish.matchScore', 'DESC')
      .addOrderBy('dish.salesCount', 'DESC')
      .take(limit)
      .getMany();

    return dishes.map((dish) => ({
      ...dish,
      type: 'dish',
      matchReason: this.generateMatchReason(dish, profile),
    }));
  }

  async getRecipeRecommendations(
    profile: HealthProfile | null,
    limit: number = 10,
  ): Promise<any[]> {
    let query = this.recipeRepository
      .createQueryBuilder('recipe')
      .where('recipe.status = 1');

    if (profile?.healthGoal) {
      query = query.andWhere(
        'JSON_CONTAINS(recipe.healthGoals, :goal)',
        { goal: `"${profile.healthGoal}"` },
      );
    }

    const recipes = await query
      .orderBy('recipe.favoriteCount', 'DESC')
      .addOrderBy('recipe.viewCount', 'DESC')
      .take(limit)
      .getMany();

    return recipes.map((recipe) => ({
      ...recipe,
      type: 'recipe',
      matchReason: this.generateRecipeMatchReason(recipe, profile),
    }));
  }

  async getRestaurantRecommendations(
    lat: number,
    lng: number,
    profile: HealthProfile | null,
    radius: number = 3,
    limit: number = 10,
  ) {
    const latMin = lat - radius * 0.009;
    const latMax = lat + radius * 0.009;
    const lngMin = lng - radius * 0.011;
    const lngMax = lng + radius * 0.011;

    const restaurants = await this.restaurantRepository
      .createQueryBuilder('restaurant')
      .where('restaurant.latitude BETWEEN :latMin AND :latMax', { latMin, latMax })
      .andWhere('restaurant.longitude BETWEEN :lngMin AND :lngMax', { lngMin, lngMax })
      .andWhere('restaurant.status = 1')
      .orderBy('restaurant.rating', 'DESC')
      .take(limit)
      .getMany();

    for (const restaurant of restaurants) {
      const dishes = await this.dishRepository.find({
        where: { restaurantId: restaurant.id, status: 1 },
        order: { matchScore: 'DESC' },
        take: 3,
      });
      (restaurant as any).matchedDishes = dishes;
    }

    return restaurants;
  }

  private generateMatchReason(dish: Dish, profile: HealthProfile | null): string {
    const reasons: string[] = [];

    if (dish.calories && profile?.dailyCalories) {
      const targetCal = Math.round(profile.dailyCalories / 3);
      if (dish.calories <= targetCal) {
        reasons.push(`低卡 ${dish.calories}kcal`);
      }
    }

    if (dish.protein && dish.protein >= 20) {
      reasons.push('高蛋白');
    }

    if (dish.tags && dish.tags.length > 0) {
      reasons.push(dish.tags[0]);
    }

    return reasons.join(' · ') || '营养均衡';
  }

  private generateRecipeMatchReason(
    recipe: Recipe,
    profile: HealthProfile | null,
  ): string {
    const reasons: string[] = [];

    if (recipe.cookingTime) {
      reasons.push(`${recipe.cookingTime}分钟`);
    }

    if (recipe.caloriesPerServing) {
      reasons.push(`${recipe.caloriesPerServing}kcal/份`);
    }

    if (recipe.tags && recipe.tags.length > 0) {
      reasons.push(recipe.tags[0]);
    }

    return reasons.join(' · ') || '健康美味';
  }
}