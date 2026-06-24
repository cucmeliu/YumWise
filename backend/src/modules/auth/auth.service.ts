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
    const appid = this.configService.get('WX_APPID');
    const secret = this.configService.get('WX_SECRET');

    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;

    try {
      const response = await axios.get(url);
      const { openid, session_key } = response.data;

      if (!openid) {
        throw new UnauthorizedException('微信登录失败');
      }

      return {
        openid,
        sessionKey: session_key,
      };
    } catch (error) {
      throw new UnauthorizedException('微信登录失败');
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