import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiGuard as ApiGuardClass } from './api-token-guard';

export function ApiGuard() {
    return applyDecorators(UseGuards(ApiGuardClass));
}
