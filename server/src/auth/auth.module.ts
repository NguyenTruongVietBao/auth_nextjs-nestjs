import {ConfigService} from '@nestjs/config';
import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {UsersModule} from '@/modules/users/users.module';
import {JwtModule} from '@nestjs/jwt';
import {LocalStrategy} from "@/auth/passport/local.strategy";
import {PassportModule} from "@nestjs/passport";
import {JwtStrategy} from "@/auth/passport/jwt.strategy";

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.registerAsync({
            useFactory: async (configService: ConfigService) => ({
                global: true,
                secret: configService.get<string>('SECRET_KEY'),
                signOptions: {
                    expiresIn: '1d',
                },
            }),
            inject: [ConfigService],
        }),
    ],
    exports: [AuthService],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {
}
