import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { AdminUserStatus } from 'src/base/constants';
import { AppUtils } from 'src/utils/utils';
import { ProductDao } from './product.dao';
import { Product } from './product.model';
import { ProductImageDao } from './product.image.dao';

@Injectable()
export class ProductImageService extends BaseService {
    constructor(private imageDao: ProductImageDao) {
        super();
    }

    public async add(payload: any): Promise<void> {
        const images = payload.images.map((img) => ({
            id: AppUtils.uuid4(),
            productId: payload.productId,
            url: img.url,
            createdAt: new Date(),
        }));

        await Promise.all(images.map((image) => this.imageDao.add(image)));
    }

    public async list(filter: any) {
        this.adjustFilterForPaging(filter);
        const result = await this.imageDao.list(filter);
        return this.mapListResult(result.count, result.items, filter);
    }

    async getById(id: any) {
        return this.imageDao.getById(id);
    }

    async delete(id: any) {
        return this.imageDao.delete(id);
    }

}
