import { Request } from 'express';
import { AdminUser } from 'src/app/admin.user/admin.user.model';

export class DashUser {
    employee: AdminUser;
}

export interface DashRequest extends Request {
    user: DashUser;
}
