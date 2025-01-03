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
import {MailerService} from "@nestjs-modules/mailer";
import {ResponseMessage} from "@/core/transform.interceptor";
import {VerifyAuthDto} from "@/auth/dto/verify-auth.dto";

@Controller('auth') // ./auth
export class AuthController {
    constructor(private readonly authService: AuthService,
                private readonly mailerService: MailerService,
    ) {
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
    @ResponseMessage('Fetch login')
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

    @Post('check-code')   // ./auth/check-code
    @PublicRoute()
    checkCode(@Body() data: VerifyAuthDto) {
        return this.authService.checkCode(data);
    }
}

