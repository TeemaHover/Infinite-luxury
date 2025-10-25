import { Module } from '@nestjs/common';
import { BaseModule } from '../../base/base.module';
import { AppDbModule } from 'src/db/db.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductDao } from './product.dao';
@Module({
    imports: [AppDbModule, BaseModule],
    controllers: [ProductController],
    providers: [ProductService, ProductDao],
    exports: [ProductService],
})
export class ProductModule {}
