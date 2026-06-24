import { Controller, Post, Body, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { successResponse } from '../../common/dto/response.dto';

@ApiTags('AI服务')
@ApiBearerAuth()
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('recipe/generate')
  @ApiOperation({ summary: 'AI生成菜谱' })
  async generateRecipe(
    @Body()
    params: {
      healthGoal: string;
      dailyCalories: number;
      restrictions: string[];
      preferences: string[];
      cookingTime?: number;
      servings?: number;
    },
  ) {
    const recipe = await this.aiService.generateRecipe(params);
    return successResponse(recipe, '菜谱生成成功');
  }
}