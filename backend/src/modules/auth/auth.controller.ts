import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/public.decorator';
import { successResponse } from '../../common/dto/response.dto';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('wechat/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '微信登录' })
  @ApiResponse({ status: 200, description: '登录成功' })
  async wechatLogin(@Body('code') code: string) {
    const wechatData = await this.authService.wechatLogin(code);
    return successResponse(wechatData, '微信授权成功');
  }

  @Public()
  @Post('token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '生成Token' })
  @ApiResponse({ status: 200, description: 'Token生成成功' })
  async generateToken(
    @Body('userId') userId: string,
    @Body('openid') openid: string,
  ) {
    const token = await this.authService.generateToken(userId, openid);
    return successResponse(token, 'Token生成成功');
  }
}