import {
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
    Query,
    Request,
    Res,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { Public } from './auth/guards/jwt/jwt-auth-guard';
import { AuthService } from './auth/auth.service';
import { Roles } from './auth/guards/role/role.decorator';
import { ADMIN } from './base/constants';
import { join } from 'path';
import { createReadStream, existsSync } from 'fs';
import * as mime from 'mime-types';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { FileService } from './file.service';
@Controller()
export class AppController {
    private readonly localPath = './uploads';
    constructor(
        private authService: AuthService,
        private fileService: FileService,
    ) {}

    @Public()
    @Get()
    getHello() {
        return { message: 'Hello' };
    }

    @Public()
    @Post('/dash/admin/login')
    async login(@Request() req) {
        return await this.authService.adminLogin(req.body);
    }

    @Public()
    @Post('/customer/login')
    async customerLogin(@Request() req) {
        return await this.authService.userLogin(req.body);
    }

    @Public()
    @Post('/customer/register')
    async customerRegister(@Request() req) {
        return await this.authService.userRegister(req.body);
    }

    @Roles(ADMIN)
    @Get('/dash/admin/me')
    async getUser(@Request() req) {
        const user = req.user;
        // console.log(JSON.stringify(user, null, 2));
        return user;
    }
    @Roles(ADMIN)
    @Post('upload')
    @UseInterceptors(
        FilesInterceptor('files', 8, {
            storage: memoryStorage(),
            limits: { fileSize: 200 * 1024 * 1024, files: 8 },
        }),
    )
    async multiFileUploadS3(@UploadedFiles() files: Express.Multer.File[]) {
        const urls = await this.fileService.processMultipleImages(files);
        return { files: urls };
    }

    @Roles(ADMIN)
    @Get('/dash/admin/me')
    async uploadFile(@Request() req) {
        const user = req.user;
        // console.log(JSON.stringify(user, null, 2));
        return user;
    }

    @Get('/health')
    @Public()
    async healchCheck() {
        return {};
    }

    @Public()
    @Get('/file/:filename')
    async getFile(@Param('filename') filename: string, @Res() res: Response) {
        const filePath = join(this.localPath, filename);

        if (!existsSync(filePath)) {
            throw new NotFoundException('File not found');
        }

        const mimeType = mime.lookup(filename) || 'application/octet-stream';
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

        const stream = createReadStream(filePath);
        stream.pipe(res);
    }
}
