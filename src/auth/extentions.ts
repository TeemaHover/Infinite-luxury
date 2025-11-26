import { Request } from 'express';
import { AdminUser } from 'src/app/admin.user/admin.user.model';
import { User } from 'src/app/user/user.model';

export class DashUser {
    employee: AdminUser;
    customer: User;
}

export interface DashRequest extends Request {
    user: DashUser;
}
