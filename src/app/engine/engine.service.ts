import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { AppUtils } from 'src/utils/utils';
import { EngineDao } from './engine.dao';
import { Engine } from './engine.model';

@Injectable()
export class EngineService extends BaseService {
    constructor(private engineDao: EngineDao) {
        super();
    }

    public async add(payload: any): Promise<void> {
        const engine: Engine = {
            id: AppUtils.uuid4(),
            name: payload.name,
            createdAt: new Date(),
        };
        await this.engineDao.add(engine);
    }

    public async update(payload: any): Promise<void> {
        await this.engineDao.update(payload);
    }

    public async list(filter: any) {
        this.adjustFilterForPaging(filter);
        const result = await this.engineDao.list(filter);
        return this.mapListResult(result.count, result.items, filter);
    }

    async getById(id: any) {
        return this.engineDao.getById(id);
    }

    async search(query) {
        return await this.engineDao.search(query);
    }
}
