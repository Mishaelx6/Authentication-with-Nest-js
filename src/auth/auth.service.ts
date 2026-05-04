import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { estate: true },
    });

    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role,
      estateId: user.estateId 
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        estateId: user.estateId,
        estate: user.estate,
      },
    };
  }

  async register(userData: {
    email: string;
    password: string;
    role: string;
    estateId: string;
    clearanceLevel?: number;
  }) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const user = await this.prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        role: userData.role as any,
        estateId: userData.estateId,
        clearanceLevel: userData.clearanceLevel || 1,
      },
      include: { estate: true },
    });

    const { password, ...result } = user;
    return result;
  }
}
