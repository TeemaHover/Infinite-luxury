import { Injectable } from '@nestjs/common';
import { BaseDao } from 'src/base/base.dao';
import { AppDB } from 'src/db/pg/app.db';
import { SqlBuilder, SqlCondition } from 'src/db/pg/sql.builder';

const tableName = 'IMAGES';

@Injectable()
export class ProductImageDao extends BaseDao {
    constructor(private readonly _db: AppDB) {
        super();
    }

    add = async (product: any) => {
        await this._db.insert(tableName, product, [
            'id',
            'productId',
            'url',
            'createdAt',
        ]);
    };

    getById = async (id: any) => {
        return await this._db.selectOne(
            `SELECT * FROM "${tableName}" WHERE "id"=$1`,
            [id],
        );
    };

    delete = async (id: string) => {
        return await this._db.select(
            `DELETE FROM "${tableName}" WHERE "id"=$1`,
            [id],
        );
    };
    deleteByProductId = async (id: string) => {
        return await this._db.select(
            `DELETE FROM "${tableName}" WHERE "productId"=$1`,
            [id],
        );
    };

    list = async (query) => {
        const { builder, criteria } = this.buildCriteria(query);

        const orderBy = this.orderBy(query.column, query.orderDirection, [
            'createdAt',
            'id',
            'name',
        ]);

        const countSql = `SELECT COUNT(*) as count FROM "${tableName}" ${criteria}`;
        const countResult = await this._db.selectOne(countSql, builder.values);
        const sql = `SELECT * FROM "${tableName}" ${criteria}
            ${orderBy} ${query.limit ? 'limit ' + query.limit : ''}  ${
            query.skip ? 'offset ' + query.skip : ''
        }`;
        const result = await this._db.select(sql, builder.values);

        return { count: countResult.count, items: result };
    };

    buildCriteria(filter: any) {
        const builder = new SqlBuilder(filter);

        const criteria = builder
            .conditionIfNotEmpty('productId', '=', filter.productId)
            .criteria();
        return { builder, criteria };
    }
}
