import {
    HttpException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminUserService } from 'src/app/admin.user/admin.user.service';
import { UserService } from 'src/app/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private adminUsersService: AdminUserService,
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    async validateAdminUser(username: string, pass: string): Promise<any> {
        const user = await this.adminUsersService.getAdminUser(username);
        if (!user) throw new HttpException('Бүртгэлгүй хэрэглэгч байна.', 401);
        const isMatch = await bcrypt.compare(pass, user.password);

        if (user && isMatch == true) {
            const { password, ...result } = user;
            return result;
        }
        if (!user) throw new HttpException('Нууц үг таарахгүй байна.', 401);
        return false;
    }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.userService.getUser(username);
        if (!user) throw new HttpException('Бүртгэлгүй хэрэглэгч байна.', 401);
        const isMatch = await bcrypt.compare(pass, user?.password ?? '');
        if (user && isMatch == true) {
            const { password, ...result } = user;
            return result;
        }
        throw new HttpException('Нууц үг таарахгүй байна.', 401);
    }

    async adminLogin(user: any) {
        console.log(user)
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
    async userLogin(user: any) {
        const result = await this.validateUser(user.username, user.password);
        if (!result) {
            throw new UnauthorizedException();
        }
        return {
            accessToken: this.jwtService.sign({
                app: 'dash',
                ...result,
            }),
            id: result.id,
            name: result.name,
            role: result.role,
            username: result.username,
        };
    }

    async userRegister(user: any) {
        const usernameCount = await this.userService.countUsername(
            user.username,
        );
        if (usernameCount > 0) {
            throw new Error('Ашиглах боломжгүй нэр байна.');
        }

        await this.userService.add(user);
    }
}
