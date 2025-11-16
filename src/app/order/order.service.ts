import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import {
    AdminUserStatus,
    OrderStatus,
    ProductStatus,
} from 'src/base/constants';
import { AppUtils } from 'src/utils/utils';
import { OrderDao } from './order.dao';
import { ProductService } from '../product/product.service';
import { Order } from './order.model';
import { UserService } from '../user/user.service';
@Injectable()
export class OrderService extends BaseService {
    constructor(
        private orderDao: OrderDao,
        private productService: ProductService,
        private userService: UserService,
    ) {
        super();
    }

    public async add(payload: any): Promise<void> {
        const user = await this.userService.getById(payload.userId);
        const product = await this.productService.getById(payload.productId);
        const order: Order = {
            id: AppUtils.uuid4(),
            status: OrderStatus.Pending,
            productId: payload.productId,
            userId: payload.userId,
            mobile: user.mobile,
            email: user.email,
            startDate: payload.startDate,
            endDate: payload.endDate,
            description: payload.description,
            meta: {
                productName: product.name,
                productImg: product.img,
                userName: user.name,
                productPrice: product.price,
            },
            createdAt: new Date(),
        };
        await this.productService.updateStatus(
            payload.productId,
            ProductStatus.Unavailable,
        );
        await this.orderDao.add(order);
    }

    public async changeProduct(payload: any) {
        await this.productService.updateStatus(
            payload.newProductId,
            ProductStatus.Unavailable,
        );
        await this.productService.updateStatus(
            payload.oldProductId,
            ProductStatus.Available,
        );
        await this.orderDao.changeProduct(payload.id, payload.newProductId);
    }

    public async updateStatus(payload: any) {
        if (payload.status === OrderStatus.Cancelled) {
            const order = await this.orderDao.getById(payload.id);
            await this.productService.updateStatus(
                order.productId,
                ProductStatus.Available,
            );
        }
        return await this.orderDao.updateStatus(payload.id, payload.status);
    }

    public async list(filter: any) {
        this.adjustFilterForPaging(filter);
        const result = await this.orderDao.list(filter);
        return this.mapListResult(result.count, result.items, filter);
    }

    public async orderSummary(userId: string) {
        const orders = await this.orderDao.list({ userId }, true);
        const summary = {
            totalOrders: 0,
            statusCount: {
                pending: 0,
                approved: 0,
            },
            totalDays: 0,
        };

        for (const order of orders.items) {
            if (order.status === OrderStatus.Cancelled) {
                continue;
            }

            summary.totalOrders++;

            if (order.status === OrderStatus.Pending) {
                summary.statusCount.pending++;
            } else if (order.status === OrderStatus.Approved) {
                summary.statusCount.approved++;
            }

            const start = AppUtils.moment(order.startDate).startOf('day');
            const end = AppUtils.moment(order.endDate).endOf('day');

            const days = Math.max(1, end.diff(start, 'days') + 1);

            summary.totalDays += days;
        }

        return summary;
    }

    async getById(id: any) {
        return this.orderDao.getById(id);
    }

    async search(query) {
        return await this.orderDao.search(query);
    }
}
