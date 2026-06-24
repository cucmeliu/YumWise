import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MealRecordService } from './meal-record.service';
import { successResponse } from '../../common/dto/response.dto';

@ApiTags('饮食记录')
@ApiBearerAuth()
@Controller('meal-records')
export class MealRecordController {
  constructor(private readonly recordService: MealRecordService) {}

  @Post()
  @ApiOperation({ summary: '创建饮食记录' })
  async create(@Request() req: any, @Body() recordData: any) {
    const record = await this.recordService.create(req.user.userId, recordData);
    return successResponse(record, '记录成功');
  }

  @Get()
  @ApiOperation({ summary: '获取饮食记录列表' })
  async getList(
    @Request() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const records = await this.recordService.findByUser(
      req.user.userId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
    return successResponse(records);
  }

  @Get('calendar')
  @ApiOperation({ summary: '获取日历数据' })
  async getCalendar(
    @Request() req: any,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    const data = await this.recordService.getCalendarData(
      req.user.userId,
      Number(year) || new Date().getFullYear(),
      Number(month) || new Date().getMonth() + 1,
    );
    return successResponse(data);
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取统计数据' })
  async getStatistics(
    @Request() req: any,
    @Query('days') days?: number,
  ) {
    const stats = await this.recordService.getStatistics(
      req.user.userId,
      Number(days) || 7,
    );
    return successResponse(stats);
  }

  @Post(':id/rating')
  @ApiOperation({ summary: '更新评价' })
  async updateRating(
    @Param('id') id: string,
    @Body('rating') rating: string,
    @Body('tags') tags?: string[],
  ) {
    const record = await this.recordService.updateRating(id, rating, tags);
    return successResponse(record, '评价成功');
  }
}