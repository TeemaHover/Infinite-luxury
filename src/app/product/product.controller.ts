import { Controller, Get, Post, Request } from '@nestjs/common';
import { BaseController } from '../../base/base.controller';
import { DashRequest } from 'src/auth/extentions';
import { Roles } from 'src/auth/guards/role/role.decorator';
import { ADMIN, CUSTOMER } from 'src/base/constants';
import { ProductService } from './product.service';
import { Public } from 'src/auth/guards/jwt/jwt-auth-guard';
import { ProductImageService } from './product.image.service';

@Controller('product')
export class ProductController extends BaseController {
    constructor(
        private readonly productService: ProductService,
        private readonly imageService: ProductImageService,
    ) {
        super(productService);
    }

    @Roles(ADMIN)
    @Post('/add')
    async add(@Request() req: DashRequest) {
        return await this.productService.add(req.body);
    }

    @Roles(ADMIN)
    @Post('/update')
    async update(@Request() req: DashRequest) {
        await this.productService.update(req.body);
    }

    @Roles(ADMIN)
    @Post('/image/add')
    async imageAdd(@Request() req: DashRequest) {
        await this.imageService.add(req.body);
    }

    @Roles(ADMIN)
    @Post('/image/delete/:id')
    async imageDelete(@Request() req: DashRequest) {
        await this.imageService.delete(req.params.id);
    }

    @Public()
    @Get('/public/list')
    async lists(@Request() req: DashRequest) {
        return await this.productService.lists(req.query);
    }
    @Roles(ADMIN, CUSTOMER)
    @Get('/list')
    async list(@Request() req: DashRequest) {
        return await this.productService.list(req.query);
    }

    @Roles(ADMIN, CUSTOMER)
    @Get('/order-dates/:productId')
    async getCarOrderDates(@Request() req: DashRequest) {
        return await this.productService.getCarOrderDates(req.params.productId);
    }

    @Roles(ADMIN, CUSTOMER)
    @Get('/detail/:id')
    async getAdminUser(@Request() req) {
        return await this.productService.getById(req.params.id);
    }
}
