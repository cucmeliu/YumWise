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
import { User } from './user.entity';

@Entity('health_profiles')
export class HealthProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  @Index()
  userId: string;

  @ManyToOne(() => User, (user) => user.healthProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    name: 'health_goal',
    type: 'enum',
    enum: ['weight_loss', 'pregnancy', 'muscle_gain', 'sugar_control', 'allergy', 'custom'],
  })
  @Index()
  healthGoal: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  height: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  bmi: number;

  @Column({ nullable: true })
  age: number;

  @Column({ name: 'daily_calories', nullable: true })
  dailyCalories: number;

  @Column({ name: 'target_weight', type: 'decimal', precision: 5, scale: 2, nullable: true })
  targetWeight: number;

  @Column({ type: 'json', nullable: true })
  restrictions: string[];

  @Column({ type: 'json', nullable: true })
  preferences: string[];

  @Column({ name: 'allergy_ingredients', type: 'json', nullable: true })
  allergyIngredients: string[];

  @Column({ name: 'medical_conditions', type: 'json', nullable: true })
  medicalConditions: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}