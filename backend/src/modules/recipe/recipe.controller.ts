import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RecipeService } from './recipe.service';
import { successResponse } from '../../common/dto/response.dto';

@ApiTags('菜谱')
@ApiBearerAuth()
@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get('popular')
  @ApiOperation({ summary: '获取热门菜谱' })
  async getPopular(@Query('limit') limit?: number) {
    const recipes = await this.recipeService.findPopular(Number(limit) || 10);
    return successResponse(recipes);
  }

  @Get('health-goal/:goal')
  @ApiOperation({ summary: '根据健康目标获取菜谱' })
  async getByHealthGoal(
    @Param('goal') goal: string,
    @Query('limit') limit?: number,
  ) {
    const recipes = await this.recipeService.findByHealthGoal(
      goal,
      Number(limit) || 10,
    );
    return successResponse(recipes);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取菜谱详情' })
  async getById(@Param('id') id: string) {
    const recipe = await this.recipeService.findById(id);
    if (recipe) {
      await this.recipeService.incrementViewCount(id);
    }
    return successResponse(recipe);
  }
}