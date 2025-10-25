import {
    Injectable,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

const CONSTANT_API_TOKEN = '1234567890';

@Injectable()
export class ApiGuard {
    constructor() {}
    

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers['authorization'];

        if (!authHeader?.startsWith('Bearer ')) {
            throw new UnauthorizedException();
        }

        const token = authHeader.split(' ')[1];
        if (token !== CONSTANT_API_TOKEN) {
            throw new UnauthorizedException('Invalid token');
        }

        return true;
    }
}
