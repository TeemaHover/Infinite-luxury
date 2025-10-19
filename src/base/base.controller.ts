import { BaseService } from './base.service';

export class BaseController {
    constructor(private readonly baseService: BaseService) {}

    public mapResult(result: any = {}) {
        if (result.meta) {
            return {
                meta: result.meta,
                items: result.data,
            };
        } else {
            return result;
        }
    }
}
