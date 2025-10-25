import { Controller, Get, Post, Request } from '@nestjs/common';
import { BaseController } from '../../base/base.controller';
import { DashRequest } from 'src/auth/extentions';
import { Roles } from 'src/auth/guards/role/role.decorator';
import { ADMIN } from 'src/base/constants';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController extends BaseController {
    constructor(private readonly productService: ProductService) {
        super(productService);
    }

    @Roles(ADMIN)
    @Post('/add')
    async add(@Request() req: DashRequest) {
        await this.productService.add(req.body);
    }

    @Roles(ADMIN)
    @Post('/update')
    async update(@Request() req: DashRequest) {
        await this.productService.update(req.body);
    }

    @Roles(ADMIN)
    @Get('/list')
    async list(@Request() req: DashRequest) {
        return await this.productService.list(req.query);
    }

    @Roles(ADMIN)
    @Get('/detail/:id')
    async getAdminUser(@Request() req) {
        return await this.productService.getById(req.params.id);
    }
}
