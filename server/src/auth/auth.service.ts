import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from '@/modules/users/users.service';
import {comparePassword} from '@/helpers/utils';
import {JwtService} from '@nestjs/jwt';
import {CreateAuthDto} from "@/auth/dto/create-auth.dto";
import {VerifyAuthDto} from "@/auth/dto/verify-auth.dto";

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
    ) {
    }

    // async login(username: string, password: string): Promise<any> {
    //     const user = await this.userService.findByEmail(username);
    //     //validate
    //     const isValidPassword = await comparePassword(password, user.password);
    //     if (!user || !isValidPassword) {
    //         throw new UnauthorizedException('Invalid credentials');
    //     }
    //     const payload = {username: user.email, sub: user._id};
    //     const token = await this.jwtService.signAsync(payload)
    //     return {
    //         user,
    //         access_token: token,
    //     };
    // }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.findByEmail(username);
        if (!user) {
            return null;
        }
        const isValidPassword = await comparePassword(password, user.password);
        if (!isValidPassword) {
            return null;
        }
        return user;
    }

    async login(user: any) {
        const payload = {username: user.email, sub: user._id};
        const token = await this.jwtService.signAsync(payload)
        return {
            user: {
                email: user.email,
                id: user._id,
                name: user.name
            },
            access_token: token,
        };
    }

    async register(registerDto: CreateAuthDto) {
        return await this.userService.register(registerDto);
    }


    async checkCode(data: VerifyAuthDto) {
        return await this.userService.handleActive(data);
    }
}
