import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { HealthProfileService } from './health-profile.service';
import { successResponse } from '../../common/dto/response.dto';

@ApiTags('健康画像')
@ApiBearerAuth()
@Controller('health-profile')
export class HealthProfileController {
  constructor(private readonly profileService: HealthProfileService) {}

  @Get()
  @ApiOperation({ summary: '获取健康画像' })
  async getProfile(@Request() req: any) {
    const profile = await this.profileService.findByUserId(req.user.userId);
    return successResponse(profile);
  }

  @Post()
  @ApiOperation({ summary: '创建/更新健康画像' })
  async saveProfile(
    @Request() req: any,
    @Body() profileData: any,
  ) {
    const profile = await this.profileService.createOrUpdate(
      req.user.userId,
      profileData,
    );
    return successResponse(profile, '保存成功');
  }
}