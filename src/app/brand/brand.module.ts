import { Module } from '@nestjs/common';
import { BaseModule } from '../../base/base.module';
import { AppDbModule } from 'src/db/db.module';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { BrandDao } from './brand.dao';
@Module({
    imports: [AppDbModule, BaseModule],
    controllers: [BrandController],
    providers: [BrandService, BrandDao],
    exports: [BrandService],
})
export class BrandModule { }
