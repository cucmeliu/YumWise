import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealRecord } from '../../entities/meal-record.entity';
import { MealRecordService } from './meal-record.service';
import { MealRecordController } from './meal-record.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MealRecord])],
  controllers: [MealRecordController],
  providers: [MealRecordService],
  exports: [MealRecordService],
})
export class MealRecordModule {}