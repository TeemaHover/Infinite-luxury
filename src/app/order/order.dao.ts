import { Injectable } from '@nestjs/common';
import { BaseDao } from 'src/base/base.dao';
import { AppDB } from 'src/db/pg/app.db';
import { SqlBuilder, SqlCondition } from 'src/db/pg/sql.builder';

const tableName = 'ORDERS';

@Injectable()
export class OrderDao extends BaseDao {
    constructor(private readonly _db: AppDB) {
        super();
    }

    add = async (data: any) => {
        await this._db.insert(tableName, data, [
            'id',
            'status',
            'productId',
            'userId',
            'mobile',
            'email',
            'startDate',
            'endDate',
            'desctiption',
            'meta',
            'createdAt',
        ]);
    };

    changeProduct = async (id: string, productId: string) => {
        return await this._db._update(`UPDATE "${tableName}" SET "productId" = $1 WHERE "id" = $2`, [productId, id])
    }

    updateStatus = async (id: string, status: number) => {
        return this._db._update(`UPDATE "${tableName}" SET "status" = $1 WHERE "id" = $2`, [status, id])
    }

    getById = async (id: any) => {
        return await this._db.selectOne(
            `SELECT * FROM "${tableName}" WHERE "id"=$1`,
            [id],
        );
    };

    list = async (query) => {
        const { builder, criteria } = this.buildCriteria(query);

        const orderBy = this.orderBy(query.column, query.orderDirection, [
            'createdAt',
            'id',
            'productId',
        ]);

        const countSql = `SELECT COUNT(*) as count FROM "${tableName}" ${criteria}`;
        const countResult = await this._db.selectOne(countSql, builder.values);
        const sql = `SELECT * FROM "${tableName}" ${criteria}
            ${orderBy} limit ${query.limit} offset ${query.skip}`;
        const result = await this._db.select(sql, builder.values);
        console.log(result)
        return { count: countResult.count, items: result };
    };

    buildCriteria(filter: any) {
        if (filter.name) {
            filter.name = `%${filter.name}%`;
        }

        if (filter.username) {
            filter.username = `%${filter.username}%`;
        }

        const builder = new SqlBuilder(filter);

        const criteria = builder
            .conditionIfNotEmpty('name', 'ILIKE', filter.name)
            .conditionIfNotEmpty('userId', '=', filter.userId)
            .criteria();
        return { builder, criteria };
    }

    async search(filter: any) {
        const builder = new SqlBuilder(filter);
        let selectFields = `"id", "name" as "value"`;

        const criteria = builder
            .conditionIfNotEmpty('name', '=', filter.name)
            .criteria();

        return await this._db.select(
            `SELECT ${selectFields} FROM "${tableName}" ${criteria} limit ${filter.limit} offset ${filter.skip}`,
            builder.values,
        );
    }
}
