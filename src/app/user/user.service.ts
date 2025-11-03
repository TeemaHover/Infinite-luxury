import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { AppUtils } from 'src/utils/utils';
import { UserDao } from './user.dao';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService extends BaseService {
    constructor(private userDao: UserDao) {
        super();
    }

    public async add(payload: any): Promise<void> {
        const product = {
            id: AppUtils.uuid4(),
            name: payload.name,
            createdAt: new Date(),
        };
        await this.userDao.add(product);
    }

    public async update(payload: any): Promise<void> {
        await this.userDao.update(payload);
    }

    public async list(filter: any) {
        this.adjustFilterForPaging(filter);
        const result = await this.userDao.list(filter);
        return this.mapListResult(result.count, result.items, filter);
    }

    async getById(id: any) {
        return this.userDao.getById(id);
    }

    public async getUser(username: string) {
        return this.userDao.get(username);
    }

    public async countUsername(username: string) {
        return this.userDao.countUsername(username)
    }

    public async changeMyPassword(req: any): Promise<void> {
        const user = await this.getById(req.user.employee.id);
        if (!user) {
            throw new Error('User not found');
        }
        const isOldPasswordMatched = await bcrypt.compare(
            req.body.oldPassword,
            user.password,
        );
        if (!isOldPasswordMatched) {
            throw new Error('Хуучин нууц үг буруу байна');
        }
        await this.userDao.changePassword(user.id, req.body.newPassword);
    }

    async search(query) {
        return await this.userDao.search(query);
    }
}
