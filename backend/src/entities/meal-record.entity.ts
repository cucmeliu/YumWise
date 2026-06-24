import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Dish } from './dish.entity';
import { Recipe } from './recipe.entity';
import { Restaurant } from './restaurant.entity';

@Entity('meal_records')
export class MealRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  @Index()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    name: 'meal_type',
    type: 'enum',
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
  })
  @Index()
  mealType: string;

  @Column({
    name: 'eat_type',
    type: 'enum',
    enum: ['dine_out', 'cook_home'],
  })
  eatType: string;

  @Column({ name: 'dish_id', nullable: true })
  dishId: string;

  @ManyToOne(() => Dish, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'dish_id' })
  dish: Dish;

  @Column({ name: 'recipe_id', nullable: true })
  recipeId: string;

  @ManyToOne(() => Recipe, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;

  @Column({ name: 'restaurant_id', nullable: true })
  restaurantId: string;

  @ManyToOne(() => Restaurant, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @Column({ name: 'meal_name', nullable: true, length: 200 })
  mealName: string;

  @Column({ name: 'meal_image', nullable: true, length: 500 })
  mealImage: string;

  @Column({ nullable: true })
  calories: number;

  @Column({
    type: 'enum',
    enum: ['good', 'neutral', 'bad'],
    nullable: true,
  })
  rating: string;

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @Column({ name: 'eaten_at', nullable: true })
  @Index()
  eatenAt: Date;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}