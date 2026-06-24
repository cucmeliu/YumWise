import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GroceryService } from './grocery.service';
import { successResponse } from '../../common/dto/response.dto';

@ApiTags('买菜跳转')
@ApiBearerAuth()
@Controller('grocery')
export class GroceryController {
  constructor(private readonly groceryService: GroceryService) {}

  @Get('platforms')
  @ApiOperation({ summary: '获取支持的买菜平台列表' })
  async getPlatforms() {
    const platforms = this.groceryService.getPlatforms();
    return successResponse(platforms);
  }

  @Post('purchase-url')
  @ApiOperation({ summary: '生成购买链接' })
  async generatePurchaseUrl(
    @Body('platformId') platformId: string,
    @Body('keywords') keywords: string[],
  ) {
    const url = this.groceryService.generatePurchaseUrl(platformId, keywords);
    return successResponse(url);
  }

  @Post('batch-purchase-urls')
  @ApiOperation({ summary: '批量生成购买链接' })
  async generateBatchPurchaseUrls(
    @Body('ingredients') ingredients: any[],
  ) {
    const urls = this.groceryService.generateBatchPurchaseUrls(ingredients);
    return successResponse(urls);
  }
}