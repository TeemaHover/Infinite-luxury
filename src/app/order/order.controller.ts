import { Controller, Get, Post, Request, UnauthorizedException } from '@nestjs/common';
import { BaseController } from '../../base/base.controller';
import { DashRequest } from 'src/auth/extentions';
import { Roles } from 'src/auth/guards/role/role.decorator';
import { ADMIN } from 'src/base/constants';
import { OrderService } from './order.service';
import { Public } from 'src/auth/guards/jwt/jwt-auth-guard';

@Controller('order')
export class OrderController extends BaseController {
    constructor(private readonly orderService: OrderService) {
        super(orderService);
    }

    @Public()
    @Post('/add')
    async add(@Request() req: DashRequest) {
        await this.orderService.add(req.body);
    }

    @Roles(ADMIN)
    @Post('/change-product')
    async changeProduct(@Request() req: DashRequest) {
        await this.orderService.changeProduct(req.body);
    }

    @Roles(ADMIN)
    @Post('/update-status')
    async updateStatus(@Request() req: DashRequest) {
        await this.orderService.updateStatus(req.body);
    }

    @Roles(ADMIN)
    @Get('/list')
    async list(@Request() req: DashRequest) {
        return await this.orderService.list(req.query);
    }

    @Public()
    @Get('/user/order/list')
    async userOrderlist(@Request() req: DashRequest) {
        if(!req.query.userId){
            throw new UnauthorizedException()
        }
        return await this.orderService.list(req.query);
    }

    @Roles(ADMIN)
    @Get('/detail/:id')
    async getAdminUser(@Request() req) {
        return await this.orderService.getById(req.params.id);
    }
}
