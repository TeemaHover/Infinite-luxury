import { Module } from '@nestjs/common';
import { BaseModule } from '../../base/base.module';
import { AppDbModule } from 'src/db/db.module';
import { OrderDao } from './order.dao';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
@Module({
    imports: [AppDbModule, BaseModule, UserModule, ProductModule],
    controllers: [OrderController],
    providers: [OrderService, OrderDao],
    exports: [OrderService],
})
export class OrderModule { }
