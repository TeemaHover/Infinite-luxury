import { Controller, Get, Post, Request } from '@nestjs/common';
import { BaseController } from '../../base/base.controller';
import { DashRequest } from 'src/auth/extentions';
import { Roles } from 'src/auth/guards/role/role.decorator';
import { ADMIN, CUSTOMER } from 'src/base/constants';
import { FeatureService } from './feature.service';

@Controller('feature')
export class FeatureController extends BaseController {
    constructor(private readonly featureService: FeatureService) {
        super(featureService);
    }

    @Roles(ADMIN)
    @Post('/add')
    async add(@Request() req: DashRequest) {
        await this.featureService.add(req.body);
    }

    @Roles(ADMIN)
    @Post('/update')
    async update(@Request() req: DashRequest) {
        await this.featureService.update(req.body);
    }

    @Roles(ADMIN, CUSTOMER)
    @Get('/list')
    async list(@Request() req: DashRequest) {
        return await this.featureService.list(req.query);
    }

    @Roles(ADMIN, CUSTOMER)
    @Get('/detail/:id')
    async getAdminUser(@Request() req) {
        return await this.featureService.getById(req.params.id);
    }
}
