import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { AdminUserStatus } from 'src/base/constants';
import { AppUtils } from 'src/utils/utils';
import { ProductDao } from './product.dao';

@Injectable()
export class ProductService extends BaseService {
    constructor(private productDao: ProductDao) {
        super();
    }

    public async add(payload: any): Promise<void> {
        const product = {
            id: AppUtils.uuid4(),
            name: payload.name,
            createdAt: new Date(),
        };
        await this.productDao.add(product);
    }

    public async update(payload: any): Promise<void> {
        await this.productDao.update(payload);
    }

    public async list(filter: any) {
        this.adjustFilterForPaging(filter);
        const result = await this.productDao.list(filter);
        return this.mapListResult(result.count, result.items, filter);
    }

    async getById(id: any) {
        return this.productDao.getById(id);
    }

    async search(query) {
        return await this.productDao.search(query);
    }
}
