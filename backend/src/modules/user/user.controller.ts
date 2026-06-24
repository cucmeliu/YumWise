import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { Public } from '../../common/decorators/public.decorator';
import { successResponse } from '../../common/dto/response.dto';

@ApiTags('用户')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: '用户登录/注册' })
  async login(@Body('code') code: string) {
    let openid: string;

    // 支持模拟登录（H5测试用）
    if (code && code.startsWith('mock_code_')) {
      openid = 'mock_openid_' + Date.now();
    } else {
      const wechatData = await this.authService.wechatLogin(code);
      openid = wechatData.openid;
    }

    let user = await this.userService.findByOpenid(openid);

    if (!user) {
      user = await this.userService.createOrUpdate(openid);
    }

    const token = await this.authService.generateToken(user.id, user.wxOpenid);

    return successResponse({
      user,
      ...token,
    }, '登录成功');
  }

  @Get('profile')
  @ApiOperation({ summary: '获取用户信息' })
  async getProfile(@Request() req: any) {
    const user = await this.userService.findById(req.user.userId);
    return successResponse(user);
  }

  @Patch('profile')
  @ApiOperation({ summary: '更新用户信息' })
  async updateProfile(
    @Request() req: any,
    @Body() userData: any,
  ) {
    const user = await this.userService.updateProfile(req.user.userId, userData);
    return successResponse(user, '更新成功');
  }
}