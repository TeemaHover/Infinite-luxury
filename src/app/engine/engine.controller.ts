import { Controller, Get, Post, Request } from '@nestjs/common';
import { BaseController } from '../../base/base.controller';
import { DashRequest } from 'src/auth/extentions';
import { Roles } from 'src/auth/guards/role/role.decorator';
import { ADMIN, CUSTOMER } from 'src/base/constants';
import { EngineService } from './engine.service';
import { Public } from 'src/auth/guards/jwt/jwt-auth-guard';

@Controller('engine')
export class EngineController extends BaseController {
    constructor(private readonly engineService: EngineService) {
        super(engineService);
    }

    @Roles(ADMIN)
    @Post('/add')
    async add(@Request() req: DashRequest) {
        await this.engineService.add(req.body);
    }

    @Roles(ADMIN)
    @Post('/update')
    async update(@Request() req: DashRequest) {
        await this.engineService.update(req.body);
    }

    @Roles(ADMIN, CUSTOMER)
    @Get('/list')
    async list(@Request() req: DashRequest) {
        return await this.engineService.list(req.query);
    }

    @Roles(ADMIN, CUSTOMER)
    @Get('/detail/:id')
    async getAdminUser(@Request() req) {
        return await this.engineService.getById(req.params.id);
    }
}
