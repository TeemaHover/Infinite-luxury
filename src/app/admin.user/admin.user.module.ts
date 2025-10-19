import { Module } from '@nestjs/common';
import { BaseModule } from '../../base/base.module';
import { AdminUserController } from './admin.user.controller';
import { AdminUserService } from './admin.user.service';
import { AdminUserDao } from './admin.user.dao';
import { AppDbModule } from 'src/db/db.module';
@Module({
    imports: [AppDbModule, BaseModule],
    controllers: [AdminUserController],
    providers: [AdminUserService, AdminUserDao],
    exports: [AdminUserService],
})
export class AdminUserModule {}
