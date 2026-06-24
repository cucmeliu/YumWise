import { Controller, Get, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RecommendationService } from './recommendation.service';
import { successResponse } from '../../common/dto/response.dto';

@ApiTags('推荐')
@ApiBearerAuth()
@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get('home')
  @ApiOperation({ summary: '获取主页推荐' })
  async getHomeRecommendations(
    @Request() req: any,
    @Query('limit') limit?: number,
  ) {
    const recommendations = await this.recommendationService.getHomeRecommendations(
      req.user.userId,
      Number(limit) || 5,
    );
    return successResponse(recommendations);
  }

  @Get('dishes')
  @ApiOperation({ summary: '获取菜品推荐' })
  async getDishRecommendations(@Request() req: any) {
    const dishes = await this.recommendationService.getDishRecommendations(
      null,
      10,
    );
    return successResponse(dishes);
  }

  @Get('recipes')
  @ApiOperation({ summary: '获取菜谱推荐' })
  async getRecipeRecommendations(@Request() req: any) {
    const recipes = await this.recommendationService.getRecipeRecommendations(
      null,
      10,
    );
    return successResponse(recipes);
  }

  @Get('restaurants')
  @ApiOperation({ summary: '获取附近餐厅推荐' })
  async getRestaurantRecommendations(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('radius') radius?: number,
  ) {
    const restaurants = await this.recommendationService.getRestaurantRecommendations(
      Number(lat),
      Number(lng),
      null,
      Number(radius) || 3,
    );
    return successResponse(restaurants);
  }
}