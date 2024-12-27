import {
    Controller,
    Post,
    UseGuards,
    Request, Get, Body
} from '@nestjs/common';
import {AuthService} from './auth.service';
import {LocalAuthGuard} from "@/auth/passport/local.auth.guard";
import {PublicRoute} from "@/auth/passport/jwt-auth.guard";
import {CreateAuthDto} from "@/auth/dto/create-auth.dto";

@Controller('auth') // ./auth
export class AuthController {
    constructor(private authService: AuthService) {

    }

    // @Post('login')
    // create(@Body() createAuthDto: CreateAuthDto) {
    //   return this.authService.login(
    //     createAuthDto.username,
    //     createAuthDto.password,
    //   );
    // }

    @Post('login')      // ./auth/login
    @PublicRoute()
    @UseGuards(LocalAuthGuard)
    login(@Request() req: any) {
        return this.authService.login(req.user);
    }

    @Post('register')   // ./auth/register
    @PublicRoute()
    register(@Body() registerDto: CreateAuthDto) {
        return this.authService.register(registerDto);
    }

    @Get('profile')     // ./auth/profile
    getProfile(@Request() req: any) {
        return req.user;
    }
}

