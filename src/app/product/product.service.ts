import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { AdminUserStatus, OrderStatus } from 'src/base/constants';
import { AppUtils } from 'src/utils/utils';
import { ProductDao } from './product.dao';
import { Product } from './product.model';
import { ProductImageDao } from './product.image.dao';
import { FeatureService } from '../feature/feature.service';

@Injectable()
export class ProductService extends BaseService {
    constructor(
        private productDao: ProductDao,
        private productImageDao: ProductImageDao,
        private feature: FeatureService,
    ) {
        super();
    }

    public async add(payload: any): Promise<void> {
        const images = payload.images;
        const product: Product = {
            id: AppUtils.uuid4(),
            name: payload.name,
            status: AdminUserStatus.Active,
            price: payload.price,
            engineId: payload.engineId,
            features: payload.features,
            transmission: payload.transmission,
            drive_type: payload.drive_type,
            driver_min_age: payload.driver_min_age,
            seats: payload.seats,
            doors: payload.doors,
            img: payload.img,
            luggage_capacity: payload.luggage_capacity,
            description: payload.description,
            brandId: payload.brandId,
            createdAt: new Date(),
        };
        const res = await this.productDao.add(product);
        if (images) {
            await Promise.all(
                images.map((image) => {
                    this.productImageDao.add({
                        id: AppUtils.uuid4(),
                        productId: res,
                        url: image,
                        createdAt: new Date(),
                    });
                }),
            );
        }

        return res;
    }

    public async update(payload: any): Promise<void> {
        const images = payload.images;
        if (images) {
            await this.productImageDao.deleteByProductId(payload.id);
            images.map((image) => {
                this.productImageDao.add({
                    id: AppUtils.uuid4(),
                    productId: payload.id,
                    url: image,
                    createdAt: new Date(),
                });
            });
        }
        await this.productDao.update(payload);
    }

    public async updateStatus(id: string, status: number) {
        await this.productDao.updateStatus(id, status);
    }

    public async list(filter: any) {
        this.adjustFilterForPaging(filter);
        const result = await this.productDao.list(filter);
        return this.mapListResult(result.count, result.items, filter);
    }

    public async lists(filter: any) {
        this.adjustFilterForPaging(filter);
        const result = await this.productDao.lists(filter);
        return this.mapListResult(result.count, result.items, filter);
    }

    async getCarOrderDates(productId: any) {
        const orders = await this.productDao.getCardOrderDates({
            status: OrderStatus.Pending,
            productId,
        });
        const finalMap: Record<number, Set<number>> = {};

        for (const order of orders) {
            const ranges = this.getMonthDayRanges(
                order.startDate,
                order.endDate,
            );

            for (const month in ranges) {
                const m = Number(month);
                if (!finalMap[m]) finalMap[m] = new Set();

                ranges[m].forEach((d) => finalMap[m].add(d));
            }
        }

        return Object.entries(finalMap).map(([month, days]) => ({
            month: Number(month),
            days: Array.from(days).sort((a, b) => a - b),
        }));
    }
    getMonthDayRanges(startDate: string, endDate: string) {
        let start = AppUtils.moment(AppUtils.parseDate(startDate)).startOf(
            'day',
        );
        let end = AppUtils.moment(AppUtils.parseDate(endDate)).startOf('day');

        const result: Record<number, Set<number>> = {};

        while (start.isSameOrBefore(end, 'day')) {
            const month = start.month() + 1;
            const day = start.date();

            if (!result[month]) result[month] = new Set();
            result[month].add(day);

            start = start.add(1, 'day');
        }

        return result;
    }

    async getById(id: any) {
        const product = await this.productDao.getById(id);
        const images = await this.productImageDao.list({ productId: id });
        product.images = images?.items ?? [];
        if (product.features) {
            product.features = await Promise.all(
                product.features?.map(async (feature) => {
                    return await this.feature.getById(feature);
                }),
            );
        }
        return product;
    }

    async search(query) {
        return await this.productDao.search(query);
    }
}
