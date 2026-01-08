import { Module } from '@nestjs/common';
import { BaseModule } from '../../base/base.module';
import { AppDbModule } from 'src/db/db.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductDao } from './product.dao';
import { ProductImageDao } from './product.image.dao';
import { ProductImageService } from './product.image.service';
import { FeatureModule } from '../feature/feature.module';
@Module({
    imports: [AppDbModule, BaseModule, FeatureModule],
    controllers: [ProductController],
    providers: [
        ProductService,
        ProductDao,
        ProductImageDao,
        ProductImageService,
    ],
    exports: [ProductService],
})
export class ProductModule {}
