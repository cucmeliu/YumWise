import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dish } from '../../entities/dish.entity';

@Injectable()
export class DishService {
  constructor(
    @InjectRepository(Dish)
    private dishRepository: Repository<Dish>,
  ) {}

  async findByRestaurant(restaurantId: string): Promise<Dish[]> {
    return this.dishRepository.find({
      where: { restaurantId, status: 1 },
      order: { matchScore: 'DESC', salesCount: 'DESC' },
    });
  }

  async findById(id: string): Promise<Dish | null> {
    return this.dishRepository.findOne({ where: { id } });
  }

  async findByCalories(maxCalories: number, limit: number = 20): Promise<Dish[]> {
    return this.dishRepository
      .createQueryBuilder('dish')
      .where('dish.calories <= :maxCalories', { maxCalories })
      .andWhere('dish.status = 1')
      .orderBy('dish.matchScore', 'DESC')
      .addOrderBy('dish.salesCount', 'DESC')
      .take(limit)
      .getMany();
  }
}