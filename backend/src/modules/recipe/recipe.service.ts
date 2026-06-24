import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from '../../entities/recipe.entity';
import { RecipeIngredient } from '../../entities/recipe-ingredient.entity';
import { RecipeStep } from '../../entities/recipe-step.entity';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    @InjectRepository(RecipeIngredient)
    private ingredientRepository: Repository<RecipeIngredient>,
    @InjectRepository(RecipeStep)
    private stepRepository: Repository<RecipeStep>,
  ) {}

  async findById(id: string): Promise<Recipe | null> {
    return this.recipeRepository.findOne({
      where: { id },
      relations: ['ingredients', 'steps'],
    });
  }

  async findByHealthGoal(healthGoal: string, limit: number = 10): Promise<Recipe[]> {
    return this.recipeRepository
      .createQueryBuilder('recipe')
      .where('JSON_CONTAINS(recipe.healthGoals, :goal)', { goal: `"${healthGoal}"` })
      .andWhere('recipe.status = 1')
      .orderBy('recipe.favoriteCount', 'DESC')
      .addOrderBy('recipe.viewCount', 'DESC')
      .take(limit)
      .getMany();
  }

  async findPopular(limit: number = 10): Promise<Recipe[]> {
    return this.recipeRepository.find({
      where: { status: 1 },
      order: { favoriteCount: 'DESC', viewCount: 'DESC' },
      take: limit,
    });
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.recipeRepository
      .createQueryBuilder()
      .update(Recipe)
      .set({ viewCount: () => 'view_count + 1' })
      .where('id = :id', { id })
      .execute();
  }

  async save(recipeData: Partial<Recipe>): Promise<Recipe> {
    return this.recipeRepository.save(recipeData);
  }
}