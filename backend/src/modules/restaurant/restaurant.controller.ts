import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RestaurantService } from './restaurant.service';
import { successResponse } from '../../common/dto/response.dto';

@ApiTags('餐厅')
@ApiBearerAuth()
@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get('nearby')
  @ApiOperation({ summary: '获取附近餐厅' })
  async getNearby(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('radius') radius?: number,
  ) {
    const restaurants = await this.restaurantService.findNearby(
      Number(lat),
      Number(lng),
      Number(radius) || 3,
    );
    return successResponse(restaurants);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取餐厅详情' })
  async getById(@Param('id') id: string) {
    const restaurant = await this.restaurantService.findById(id);
    return successResponse(restaurant);
  }
}