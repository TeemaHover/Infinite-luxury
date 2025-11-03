import { Module } from '@nestjs/common';
import { BaseModule } from '../../base/base.module';
import { AppDbModule } from 'src/db/db.module';
import { EngineController } from './engine.controller';
import { EngineService } from './engine.service';
import { EngineDao } from './engine.dao';
@Module({
    imports: [AppDbModule, BaseModule],
    controllers: [EngineController],
    providers: [EngineService, EngineDao],
    exports: [EngineService],
})
export class EngineModule { }
