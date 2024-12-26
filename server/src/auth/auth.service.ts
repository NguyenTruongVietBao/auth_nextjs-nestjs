import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from '@/modules/users/users.service';
import { comparePassword } from '@/helpers/utils';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(username);
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: user.email, sub: user._id };
    return {
      user,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  // async register(createAuthDto: CreateAuthDto) {
  //   // return this.userService.create(createAuthDto);
  // }
}
