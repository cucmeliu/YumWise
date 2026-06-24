import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DishService } from './dish.service';
import { successResponse } from '../../common/dto/response.dto';

@ApiTags('菜品')
@ApiBearerAuth()
@Controller('dishes')
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @Get('restaurant/:restaurantId')
  @ApiOperation({ summary: '获取餐厅菜品列表' })
  async getByRestaurant(@Param('restaurantId') restaurantId: string) {
    const dishes = await this.dishService.findByRestaurant(restaurantId);
    return successResponse(dishes);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取菜品详情' })
  async getById(@Param('id') id: string) {
    const dish = await this.dishService.findById(id);
    return successResponse(dish);
  }
}