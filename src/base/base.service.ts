import { Injectable } from '@nestjs/common';
import { DEFAULT_LIMIT } from './constants';
import { Meta } from './base.interface';
import { DashUser } from 'src/auth/extentions';
import * as XLSX from 'xlsx';
import { File } from 'multer';
import axios from 'axios';

@Injectable()
export class BaseService {
    public mapListResult(
        count: number,
        items: any[],
        filter: any,
        summary?: any,
    ) {
        const result: any = {};
        const limit = filter.limit > 0 ? filter.limit : DEFAULT_LIMIT;

        const currentPage = filter.page > 0 ? filter.page : 1;
        const totalCount = count;
        const perPage = limit;
        const helper = Math.floor(count / limit);
        const pageCount = helper == 0 ? 1 : helper;
        const meta: Meta = {
            totalCount: totalCount,
            pageCount: pageCount,
            currentPage: currentPage,
            perPage: perPage,
        };
        if (summary) {
            result.summary = summary;
        }
        result.meta = meta;
        result.items = items;
        return result;
    }

    public adjustFilterForPaging(filter: any) {
        filter.limit = Number(filter.size || '' + DEFAULT_LIMIT);
        filter.skip = Number(filter.page || '0') * filter.limit;
        filter.column = filter.column || 'createdAt';
        filter.orderDirection = filter.orderDirection || 'DESC';
    }

    public applyFilter(filter: any, user: any): any {
        if (user) {
            if (user.merchant) {
                filter.merchantId = user.merchant.id;
            } else if (user.terminal) {
                filter.merchantId = user.terminal.merchantId;
                filter.terminalId = user.terminal.id;
            }
        }
        return filter;
    }

    decodeBase64File(base64Str: string): Buffer {
        if (!base64Str) {
            throw new Error('Base64 string is missing.');
        }

        const base64 = base64Str.split(';base64,')[1];

        if (!base64) {
            throw new Error('Invalid base64 format.');
        }
        return Buffer.from(base64, 'base64');
    }

    public async parseExcelFile(file: File) {
        const buffer = this.decodeBase64File(file.base64);
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        return XLSX.utils.sheet_to_json(worksheet, {
            raw: false, // Forces cell text formatting (e.g. '0123' stays '0123')
            defval: null, // Optional: fills empty cells with empty string
        });
    }

    public async queueRequest(url: string, params: any) {
        const config = {
            method: 'GET',
            maxBodyLength: Infinity,
            url: `${process.env.QUEUE_URL}/${url}`,
            headers: {
                'Content-Type': 'application/json',
            },
            params: params || {},
        };

        return await axios.request(config);
    }

    public async batchRequest(url: string) {
        const config = {
            method: 'GET',
            maxBodyLength: Infinity,
            url: `${process.env.QUEUE_URL}/batch/start/${url}`,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        return await axios.request(config);
    }
}
