import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByOpenid(openid: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { wxOpenid: openid } });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }

  async createOrUpdate(openid: string, userData?: Partial<User>): Promise<User> {
    let user = await this.findByOpenid(openid);

    if (!user) {
      user = this.userRepository.create({
        id: uuidv4(),
        wxOpenid: openid,
        ...userData,
      });
    } else if (userData) {
      Object.assign(user, userData);
    }

    return this.userRepository.save(user);
  }

  async updateProfile(id: string, userData: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    Object.assign(user, userData);
    return this.userRepository.save(user);
  }
}