import { Controller, Get, Post, Request } from '@nestjs/common';
import { BaseController } from '../../base/base.controller';
import { AdminUserService } from './admin.user.service';
import { DashRequest } from 'src/auth/extentions';
import { Roles } from 'src/auth/guards/role/role.decorator';
import { ADMIN } from 'src/base/constants';

@Controller('admin-user')
export class AdminUserController extends BaseController {
    constructor(private readonly userService: AdminUserService) {
        super(userService);
    }

    @Roles(ADMIN)
    @Post('/add')
    async addAdminUser(@Request() req: DashRequest) {
        await this.userService.addAdminUser(req.body);
    }

    @Roles(ADMIN)
    @Post('/update')
    async updateAdminUser(@Request() req: DashRequest) {
        await this.userService.updateAdminUser(req.body);
    }

    @Roles(ADMIN)
    @Post('/change-password')
    async changePassword(@Request() req: DashRequest) {
        await this.userService.changePassword(req.body);
    }

    @Roles(ADMIN)
    @Get()
    async getAdminUsersList(@Request() req: DashRequest) {
        return await this.userService.getAdminUsersList(req.query);
    }

    @Roles(ADMIN)
    @Get('/detail/:id')
    async getAdminUser(@Request() req) {
        return await this.userService.getAdminUserInfo(req.params.id);
    }
}
