import { Module } from '@nestjs/common';
import { BaseModule } from '../../base/base.module';
import { AppDbModule } from 'src/db/db.module';
import { FeatureController } from './feature.controller';
import { FeatureService } from './feature.service';
import { FeatureDao } from './feature.dao';
@Module({
    imports: [AppDbModule, BaseModule],
    controllers: [FeatureController],
    providers: [FeatureService, FeatureDao],
    exports: [FeatureService],
})
export class FeatureModule {}
