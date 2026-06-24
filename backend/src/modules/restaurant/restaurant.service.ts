import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Restaurant } from '../../entities/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  async findNearby(
    lat: number,
    lng: number,
    radius: number = 3,
    limit: number = 20,
  ): Promise<Restaurant[]> {
    const latMin = lat - radius * 0.009;
    const latMax = lat + radius * 0.009;
    const lngMin = lng - radius * 0.011;
    const lngMax = lng + radius * 0.011;

    return this.restaurantRepository.find({
      where: {
        latitude: Between(latMin, latMax),
        longitude: Between(lngMin, lngMax),
        status: 1,
      },
      order: { rating: 'DESC' },
      take: limit,
    });
  }

  async findById(id: string): Promise<Restaurant | null> {
    return this.restaurantRepository.findOne({ where: { id } });
  }

  async findByCity(city: string, limit: number = 20): Promise<Restaurant[]> {
    return this.restaurantRepository.find({
      where: { city, status: 1 },
      order: { rating: 'DESC' },
      take: limit,
    });
  }
}