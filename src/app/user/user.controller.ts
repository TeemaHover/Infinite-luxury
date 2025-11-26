import { Controller, Get, Post, Req, Request } from '@nestjs/common';
import { BaseController } from '../../base/base.controller';
import { DashRequest } from 'src/auth/extentions';
import { Roles } from 'src/auth/guards/role/role.decorator';
import { ADMIN, CUSTOMER } from 'src/base/constants';
import { UserService } from './user.service';
import { Public } from 'src/auth/guards/jwt/jwt-auth-guard';

@Controller('user')
export class UserController extends BaseController {
    constructor(private readonly userService: UserService) {
        super(userService);
    }

    @Public()
    @Post('/add')
    async add(@Request() req: DashRequest) {
        await this.userService.add(req.body);
    }

    @Roles(ADMIN)
    @Post('/update')
    async update(@Request() req: DashRequest) {
        await this.userService.update(req.body);
    }

    @Roles(ADMIN)
    @Get('/list')
    async list(@Request() req: DashRequest) {
        return await this.userService.list(req.query);
    }

    @Roles(ADMIN, CUSTOMER)
    @Get('/detail/:id')
    async getAdminUser(@Request() req) {
        return await this.userService.getById(req.params.id);
    }

    @Roles(CUSTOMER)
    @Get('/me')
    async me(@Req() { user }) {
        return user;
    }
}
