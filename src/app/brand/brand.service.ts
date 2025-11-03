import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { AdminUserStatus } from 'src/base/constants';
import { AppUtils } from 'src/utils/utils';
import { BrandDao } from './brand.dao';
import { Brand } from './brand.model';

@Injectable()
export class BrandService extends BaseService {
    constructor(private brandDao: BrandDao) {
        super();
    }

    public async add(payload: any): Promise<void> {
        const brand: Brand = {
            id: AppUtils.uuid4(),
            name: payload.name,
            createdAt: new Date(),
        };
        await this.brandDao.add(brand);
    }

    public async update(payload: any): Promise<void> {
        await this.brandDao.update(payload);
    }

    public async list(filter: any) {
        this.adjustFilterForPaging(filter);
        const result = await this.brandDao.list(filter);
        return this.mapListResult(result.count, result.items, filter);
    }

    async getById(id: any) {
        return this.brandDao.getById(id);
    }

    async search(query) {
        return await this.brandDao.search(query);
    }
}
