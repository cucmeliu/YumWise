import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { MealRecord } from '../../entities/meal-record.entity';

@Injectable()
export class MealRecordService {
  constructor(
    @InjectRepository(MealRecord)
    private recordRepository: Repository<MealRecord>,
  ) {}

  async create(userId: string, recordData: Partial<MealRecord>): Promise<MealRecord> {
    const record = this.recordRepository.create({
      id: uuidv4(),
      userId,
      ...recordData,
      eatenAt: recordData.eatenAt || new Date(),
    });
    return this.recordRepository.save(record);
  }

  async findByUser(
    userId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<MealRecord[]> {
    let query = this.recordRepository
      .createQueryBuilder('record')
      .where('record.userId = :userId', { userId })
      .leftJoinAndSelect('record.dish', 'dish')
      .leftJoinAndSelect('record.recipe', 'recipe')
      .leftJoinAndSelect('record.restaurant', 'restaurant');

    if (startDate && endDate) {
      query = query.andWhere('record.eatenAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    return query.orderBy('record.eatenAt', 'DESC').getMany();
  }

  async findByDate(userId: string, date: Date): Promise<MealRecord[]> {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return this.findByUser(userId, start, end);
  }

  async getCalendarData(
    userId: string,
    year: number,
    month: number,
  ): Promise<any> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const records = await this.findByUser(userId, startDate, endDate);

    const calendarData: { [key: string]: number } = {};
    records.forEach((record) => {
      const dateKey = record.eatenAt.toISOString().split('T')[0];
      calendarData[dateKey] = (calendarData[dateKey] || 0) + 1;
    });

    return calendarData;
  }

  async updateRating(
    id: string,
    rating: string,
    tags?: string[],
  ): Promise<MealRecord> {
    const record = await this.recordRepository.findOne({ where: { id } });
    if (!record) {
      throw new Error('记录不存在');
    }

    record.rating = rating as any;
    if (tags) {
      record.tags = tags;
    }

    return this.recordRepository.save(record);
  }

  async getStatistics(userId: string, days: number = 7): Promise<any> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const records = await this.findByUser(userId, startDate, endDate);

    const totalCalories = records.reduce(
      (sum, r) => sum + (r.calories || 0),
      0,
    );

    const mealTypeCount = {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snack: 0,
    };

    const ratingCount = {
      good: 0,
      neutral: 0,
      bad: 0,
    };

    records.forEach((r) => {
      mealTypeCount[r.mealType] = (mealTypeCount[r.mealType] || 0) + 1;
      if (r.rating) {
        ratingCount[r.rating] = (ratingCount[r.rating] || 0) + 1;
      }
    });

    return {
      totalRecords: records.length,
      totalCalories,
      avgCaloriesPerDay: Math.round(totalCalories / days),
      mealTypeCount,
      ratingCount,
    };
  }
}