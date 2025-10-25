import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { AdminUserStatus, OrderStatus, ProductStatus } from 'src/base/constants';
import { AppUtils } from 'src/utils/utils';
import { OrderDao } from './order.dao';
import { ProductService } from '../product/product.service';
@Injectable()
export class OrderService extends BaseService {
    constructor(private orderDao: OrderDao, private productService: ProductService) {
        super();
    }

    public async add(payload: any): Promise<void> {
        const order = {
            id: AppUtils.uuid4(),
            productId: payload.productId,
            status: OrderStatus.Pending,
            createdAt: new Date(),
        };
        await this.productService.updateStatus(payload.productId, ProductStatus.Unavailable)
        await this.orderDao.add(order);
    }

    public async changeProduct(payload: any) {
        await this.productService.updateStatus(payload.newProductId, ProductStatus.Unavailable)
        await this.productService.updateStatus(payload.oldProductId, ProductStatus.Available)
        await this.orderDao.changeProduct(payload.id, payload.newProductId);
    }

    public async updateStatus(payload: any) {
        if (payload.status === OrderStatus.Cancelled) {
            const order = await this.orderDao.getById(payload.id)
            await this.productService.updateStatus(order.productId, ProductStatus.Available)
        }
        return await this.orderDao.updateStatus(payload.id, payload.status)
    }

    public async list(filter: any) {
        this.adjustFilterForPaging(filter);
        const result = await this.orderDao.list(filter);
        return this.mapListResult(result.count, result.items, filter);
    }

    async getById(id: any) {
        return this.orderDao.getById(id);
    }

    async search(query) {
        return await this.orderDao.search(query);
    }
}
