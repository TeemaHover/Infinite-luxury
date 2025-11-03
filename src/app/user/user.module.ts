import { Module } from '@nestjs/common';
import { BaseModule } from '../../base/base.module';
import { AppDbModule } from 'src/db/db.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserDao } from './user.dao';
@Module({
    imports: [AppDbModule, BaseModule],
    controllers: [UserController],
    providers: [UserService, UserDao],
    exports: [UserService],
})
export class UserModule { }
