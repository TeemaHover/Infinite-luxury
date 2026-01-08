import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { AppUtils } from 'src/utils/utils';
import { FeatureDao } from './feature.dao';
import { Feature } from './feature.model';

@Injectable()
export class FeatureService extends BaseService {
    constructor(private featureDao: FeatureDao) {
        super();
    }

    public async add(payload: any): Promise<void> {
        const feature: Feature = {
            id: AppUtils.uuid4(),
            name: payload.name,
            description: payload.description,
            images: payload.images,
            createdAt: new Date(),
        };
        await this.featureDao.add(feature);
    }

    public async update(payload: any): Promise<void> {
        await this.featureDao.update(payload);
    }

    public async list(filter: any) {
        this.adjustFilterForPaging(filter);
        const result = await this.featureDao.list(filter);
        return this.mapListResult(result.count, result.items, filter);
    }

    async getById(id: any) {
        return this.featureDao.getById(id);
    }

    async search(query) {
        return await this.featureDao.search(query);
    }
}
