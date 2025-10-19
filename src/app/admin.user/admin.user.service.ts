import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { AdminUserDao } from './admin.user.dao';
import { AdminUserStatus } from 'src/base/constants';
import * as bcrypt from 'bcrypt';
import { AppUtils } from 'src/utils/utils';

@Injectable()
export class AdminUserService extends BaseService {
    constructor(private userDao: AdminUserDao) {
        super();
    }

    public async addAdminUser(user: any): Promise<void> {
        user.id = AppUtils.uuid4();
        user.status = AdminUserStatus.Active;
        await this.userDao.add(user);
    }

    public async updateAdminUser(user: any): Promise<void> {
        await this.userDao.update(user);
    }

    public async changePassword(user: any): Promise<void> {
        await this.userDao.changePassword(user.id, user.password);
    }

    public async getAdminUsersList(filter: any) {
        this.adjustFilterForPaging(filter);
        const count = await this.userDao.totalCount(filter);
        const result = await this.userDao.list(filter);
        return this.mapListResult(count, result, filter);
    }

    async getAdminUserById(filter: any) {
        return this.userDao.getById(filter.id);
    }

    async getById(id: any) {
        return this.userDao.getById(id);
    }

    async getAdminUserInfo(id: string) {
        return this.userDao.getAdminUserInfo(id);
    }

    async getAdminUser(username: string) {
        return this.userDao.get(username);
    }

    async search(query) {
        return await this.userDao.search(query);
    }

    public async changeMyPassword(req: any): Promise<void> {
        const user = await this.getAdminUserById(req.user.employee);
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
}
