import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from 'src/auth/constants';
import { AdminUserService } from 'src/app/admin.user/admin.user.service';
import { DashRequest, DashUser } from 'src/auth/extentions';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private adminUsersService: AdminUserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
            passReqToCallback: true,
        });
    }

    async validate(req: DashRequest, payload: any) {
        const user = await this.adminUsersService.getAdminUserById(payload);
        if (!user) {
            throw new UnauthorizedException();
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        // req.user.app = payload.app;
        const { password, ...result } = user;
        return <DashUser>{
            employee: result,
        };
    }
}
