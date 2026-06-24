import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  name: string;

  @Column({ name: 'brand_name', nullable: true, length: 200 })
  brandName: string;

  @Column({ name: 'logo_url', nullable: true, length: 500 })
  logoUrl: string;

  @Column({ name: 'cover_url', nullable: true, length: 500 })
  coverUrl: string;

  @Column({ nullable: true, length: 50 })
  province: string;

  @Column({ nullable: true, length: 50 })
  city: string;

  @Column({ nullable: true, length: 50 })
  district: string;

  @Column({ nullable: true, length: 500 })
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  @Index()
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  @Index()
  longitude: number;

  @Column({ nullable: true, length: 50 })
  phone: string;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  @Index()
  rating: number;

  @Column({ name: 'review_count', default: 0 })
  reviewCount: number;

  @Column({ name: 'avg_price', nullable: true })
  avgPrice: number;

  @Column({ name: 'cuisine_types', type: 'json', nullable: true })
  cuisineTypes: string[];

  @Column({ type: 'json', nullable: true })
  features: string[];

  @Column({ name: 'business_hours', nullable: true, length: 200 })
  businessHours: string;

  @Column({ name: 'meituan_id', nullable: true, length: 100 })
  @Index()
  meituanId: string;

  @Column({ name: 'eleme_id', nullable: true, length: 100 })
  elemeId: string;

  @Column({ name: 'gaode_poi_id', nullable: true, length: 100 })
  gaodePoiId: string;

  @Column({ default: 1 })
  status: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}