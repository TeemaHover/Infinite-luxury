import { Controller, Get, Post, Query, Request } from '@nestjs/common';
import { Public } from './auth/guards/jwt/jwt-auth-guard';
import { AuthService } from './auth/auth.service';
import { Roles } from './auth/guards/role/role.decorator';
import { ADMIN } from './base/constants';

@Controller()
export class AppController {
    constructor(private authService: AuthService) { }

    @Public()
    @Get()
    getHello() {
        return { message: 'Hello' };
    }

    @Public()
    @Post('/dash/admin/login')
    async login(@Request() req) {
        return await this.authService.adminLogin(req.body);
    }

    @Public()
    @Post('/customer/login')
    async customerLogin(@Request() req) {
        return await this.authService.userLogin(req.body);
    }

    @Public()
    @Post('/customer/register')
    async customerRegister(@Request() req) {
        return await this.authService.userRegister(req.body);
    }

    @Roles(ADMIN)
    @Get('/dash/admin/me')
    async getUser(@Request() req) {
        const user = req.user;
        // console.log(JSON.stringify(user, null, 2));
        return user;
    }

    @Get('/health')
    @Public()
    async healchCheck() {
        return {};
    }
}
