import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './guards/jwt/jwt.strategy';
import { AdminUserModule } from 'src/app/admin.user/admin.user.module';

@Module({
    imports: [
        AdminUserModule,
        PassportModule,

        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '30d' },
        }),
    ],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}
