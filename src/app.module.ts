import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt/jwt-auth-guard';
import { RolesGuard } from './auth/guards/role/role.guard';
import { AuthModule } from './auth/auth.module';
import { BaseModule } from './base/base.module';
import { AllExceptionsFilter } from './utils/all-exceptions.filter';
import { PostInterceptor } from './post.interceptor';

@Module({
    imports: [ConfigModule.forRoot(), AuthModule, BaseModule],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: PostInterceptor,
        },
    ],
})
export class AppModule {}
