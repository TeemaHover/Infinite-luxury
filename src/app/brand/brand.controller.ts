import { Controller, Delete, Get, Param, Post, Request } from '@nestjs/common';
import { BaseController } from '../../base/base.controller';
import { DashRequest } from 'src/auth/extentions';
import { Roles } from 'src/auth/guards/role/role.decorator';
import { ADMIN, CUSTOMER } from 'src/base/constants';
import { BrandService } from './brand.service';
import { Public } from 'src/auth/guards/jwt/jwt-auth-guard';

@Controller('brand')
export class BrandController extends BaseController {
    constructor(private readonly brandService: BrandService) {
        super(brandService);
    }

    @Roles(ADMIN)
    @Post('/add')
    async add(@Request() req: DashRequest) {
        await this.brandService.add(req.body);
    }

    @Roles(ADMIN)
    @Post('/update')
    async update(@Request() req: DashRequest) {
        await this.brandService.update(req.body);
    }
    @Roles(ADMIN)
    @Delete('/:id')
    async delete(@Param('id') id: string, @Request() req: DashRequest) {
        await this.brandService.delete(id);
    }

    @Roles(ADMIN, CUSTOMER)
    @Get('/list')
    async list(@Request() req: DashRequest) {
        return await this.brandService.list(req.query);
    }

    @Roles(ADMIN, CUSTOMER)
    @Get('/detail/:id')
    async getAdminUser(@Request() req) {
        return await this.brandService.getById(req.params.id);
    }
}
