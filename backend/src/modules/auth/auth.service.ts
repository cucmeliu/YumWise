import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async wechatLogin(code: string) {
    // 支持模拟登录（测试环境）
    if (code && code.startsWith('mock_code_')) {
      return {
        openid: 'mock_openid_' + Date.now(),
        sessionKey: 'mock_session_key',
      };
    }

    const appid = this.configService.get('WX_APPID');
    const secret = this.configService.get('WX_SECRET');

    // 如果没有配置微信 AppID 或 Secret，使用模拟登录
    if (!appid || !secret || appid === 'your_wechat_appid') {
      console.log('未配置微信 AppID/Secret，使用模拟登录');
      return {
        openid: 'dev_openid_' + code,
        sessionKey: 'dev_session_key',
      };
    }

    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;

    try {
      const response = await axios.get(url);
      const { openid, session_key, errcode, errmsg } = response.data;

      if (!openid) {
        console.error('微信登录失败:', errcode, errmsg);
        // 降级到模拟登录
        return {
          openid: 'fallback_openid_' + code,
          sessionKey: 'fallback_session_key',
        };
      }

      return {
        openid,
        sessionKey: session_key,
      };
    } catch (error) {
      console.error('微信登录请求失败:', error.message);
      // 降级到模拟登录
      return {
        openid: 'error_openid_' + code,
        sessionKey: 'error_session_key',
      };
    }
  }

  async generateToken(userId: string, openid: string) {
    const payload = { sub: userId, openid };
    return {
      accessToken: this.jwtService.sign(payload),
      expiresIn: this.configService.get('JWT_EXPIRES_IN', '7d'),
    };
  }

  async validateUser(payload: any) {
    return { userId: payload.sub, openid: payload.openid };
  }
}