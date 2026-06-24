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

@Entity('recipe_steps')
export class RecipeStep {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'recipe_id' })
  @Index()
  recipeId: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.steps, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;

  @Column({ name: 'step_order' })
  stepOrder: number;

  @Column({ type: 'text' })
  instruction: string;

  @Column({ name: 'image_url', nullable: true, length: 500 })
  imageUrl: string;

  @Column({ name: 'video_url', nullable: true, length: 500 })
  videoUrl: string;

  @Column({ nullable: true })
  duration: number;

  @Column({ nullable: true, length: 500 })
  tips: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}