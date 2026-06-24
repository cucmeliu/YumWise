import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Recipe } from './recipe.entity';

@Entity('recipe_ingredients')
export class RecipeIngredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'recipe_id' })
  @Index()
  recipeId: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.ingredients, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;

  @Column({ length: 100 })
  name: string;

  @Column({ nullable: true, length: 50 })
  amount: string;

  @Column({ name: 'amount_grams', nullable: true })
  amountGrams: number;

  @Column({ nullable: true, length: 50 })
  @Index()
  category: string;

  @Column({ name: 'is_optional', default: 0 })
  isOptional: number;

  @Column({ name: 'is_staple', default: 0 })
  isStaple: number;

  @Column({ default: 1 })
  purchasable: number;

  @Column({ name: 'purchase_url', nullable: true, length: 500 })
  purchaseUrl: string;

  @Column({ name: 'estimated_price', nullable: true })
  estimatedPrice: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}