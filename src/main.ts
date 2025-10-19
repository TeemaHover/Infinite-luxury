import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationError, useContainer } from 'class-validator';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
const path = require('path');
global.__basedir = path.resolve(__dirname, '..');

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: '*',
    });
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ limit: '50mb', extended: true }));

    app.useGlobalPipes(
        new ValidationPipe({
            exceptionFactory: (validationErrors: ValidationError[] = []) => {
                const message = Object.values(
                    validationErrors[0].constraints || '',
                ).join(', ');
                return new BadRequestException(message);
            },
        }),
    );
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
