import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Restaurant } from './restaurant.entity';

@Entity('dishes')
export class Dish {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'restaurant_id' })
  @Index()
  restaurantId: string;

  @ManyToOne(() => Restaurant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @Column({ length: 200 })
  name: string;

  @Column({ name: 'image_url', nullable: true, length: 500 })
  imageUrl: string;

  @Column({ nullable: true })
  price: number;

  @Column({ name: 'original_price', nullable: true })
  originalPrice: number;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true })
  @Index()
  calories: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  protein: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  carbs: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  fat: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  fiber: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  sodium: number;

  @Column({ name: 'serving_size', nullable: true, length: 50 })
  servingSize: string;

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @Column({ type: 'json', nullable: true })
  ingredients: string[];

  @Column({ name: 'is_spicy', default: 0 })
  isSpicy: number;

  @Column({ name: 'is_vegetarian', default: 0 })
  isVegetarian: number;

  @Column({ name: 'match_score', type: 'decimal', precision: 3, scale: 2, default: 0 })
  @Index()
  matchScore: number;

  @Column({ name: 'sales_count', default: 0 })
  salesCount: number;

  @Column({ name: 'review_count', default: 0 })
  reviewCount: number;

  @Column({ default: 1 })
  status: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}