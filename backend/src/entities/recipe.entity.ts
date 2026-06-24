import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { RecipeIngredient } from './recipe-ingredient.entity';
import { RecipeStep } from './recipe-step.entity';

@Entity('recipes')
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  name: string;

  @Column({
    type: 'enum',
    enum: ['ai_generated', 'curated', 'user_created'],
    default: 'curated',
  })
  @Index()
  type: string;

  @Column({ name: 'cover_url', nullable: true, length: 500 })
  coverUrl: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ name: 'health_goals', type: 'json', nullable: true })
  @Index()
  healthGoals: string[];

  @Column({ name: 'cuisine_type', nullable: true, length: 50 })
  cuisineType: string;

  @Column({ default: 1 })
  difficulty: number;

  @Column({ default: 2 })
  servings: number;

  @Column({ name: 'cooking_time', nullable: true })
  @Index()
  cookingTime: number;

  @Column({ name: 'calories_per_serving', nullable: true })
  caloriesPerServing: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  protein: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  carbs: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  fat: number;

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @Column({ nullable: true, type: 'text' })
  tips: string;

  @Column({ name: 'nutritionist_reviewed', default: 0 })
  nutritionistReviewed: number;

  @Column({ name: 'view_count', default: 0 })
  viewCount: number;

  @Column({ name: 'favorite_count', default: 0 })
  @Index()
  favoriteCount: number;

  @Column({ name: 'creator_id', nullable: true })
  creatorId: string;

  @Column({ default: 1 })
  status: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => RecipeIngredient, (ingredient) => ingredient.recipe)
  ingredients: RecipeIngredient[];

  @OneToMany(() => RecipeStep, (step) => step.recipe)
  steps: RecipeStep[];
}