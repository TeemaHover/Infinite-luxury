import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminUserService } from 'src/app/admin.user/admin.user.service';

@Injectable()
export class AuthService {
    constructor(
        private adminUsersService: AdminUserService,
        private jwtService: JwtService,
    ) {}

    async validateAdminUser(username: string, pass: string): Promise<any> {
        const user = await this.adminUsersService.getAdminUser(username);
        const isMatch = await bcrypt.compare(pass, user.password);
        if (user && isMatch == true) {
            const { password, ...result } = user;
            return result;
        }
        return false;
    }

    async adminLogin(user: any) {
        const result = await this.validateAdminUser(
            user.username,
            user.password,
        );
        if (!result) {
            throw new UnauthorizedException();
        }
        return {
            accessToken: this.jwtService.sign({
                app: 'dash',
                ...result,
            }),
            name: result.name,
            role: result.role,
            username: result.username,
        };
    }
}
