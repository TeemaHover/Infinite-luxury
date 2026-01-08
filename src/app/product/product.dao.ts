import { Injectable } from '@nestjs/common';
import { BaseDao } from 'src/base/base.dao';
import { AppDB } from 'src/db/pg/app.db';
import { SqlBuilder, SqlCondition } from 'src/db/pg/sql.builder';

const tableName = 'PRODUCTS';

@Injectable()
export class ProductDao extends BaseDao {
    constructor(private readonly _db: AppDB) {
        super();
    }

    add = async (product: any) => {
        const res = await this._db.insert(tableName, product, [
            'id',
            'name',
            'status',
            'price',
            'engineId',
            'brandId',
            'features',
            'transmission',
            'drive_type',
            'driver_min_age',
            'seats',
            'doors',
            'luggage_capacity',
            'bluetooth',
            'img',
            'description',
            'aux',
            'gps',
            'createdAt',
        ]);
        return res;
    };

    update = async (product: any) => {
        await this._db.update(
            tableName,
            product,
            [
                'name',
                'engineId',
                'transmission',
                'drive_type',
                'driver_min_age',
                'seats',
                'doors',
                'features',
                'img',
                'description',
                'luggage_capacity',
            ],
            [new SqlCondition('id', '=', product.id)],
        );
    };

    updateStatus = async (id: string, status: number) => {
        await this._db.update(
            tableName,
            { status },
            ['status'],
            [new SqlCondition('id', '=', id)],
        );
    };

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
            'name',
        ]);

        const countSql = `SELECT COUNT(*) as count FROM "${tableName}" ${criteria}`;
        const countResult = await this._db.selectOne(countSql, builder.values);
        const sql = `SELECT "id", "name", "img" FROM "${tableName}" ${criteria}
            ${orderBy} limit ${query.limit} offset ${query.skip}`;
        const result = await this._db.select(sql, builder.values);

        return { count: countResult.count, items: result };
    };
    lists = async (query) => {
        const { builder, criteria } = this.buildCriteria(query);

        const orderBy = this.orderBy(query.column, query.orderDirection, [
            'createdAt',
            'id',
            'name',
        ]);

        const countSql = `SELECT COUNT(*) as count FROM "${tableName}" ${criteria}`;
        const countResult = await this._db.selectOne(countSql, builder.values);
        const sql = `SELECT * FROM "${tableName}" ${criteria}
            ${orderBy} limit ${query.limit} offset ${query.skip}`;
        const result = await this._db.select(sql, builder.values);

        return { count: countResult.count, items: result };
    };

    getCardOrderDates = async (query: any) => {
        const { builder, criteria } = this.buildCriteria(query);

        const sql = `SELECT * FROM "ORDERS" ${criteria}`;
        const result = await this._db.select(sql, builder.values);
        return result;
    };

    buildCriteria(filter: any) {
        if (filter.name) {
            filter.name = `%${filter.name}%`;
        }

        const builder = new SqlBuilder(filter);

        const criteria = builder
            .conditionIfNotEmpty('name', 'ILIKE', filter.name)
            .conditionIfNotEmpty('productId', '=', filter.productId)
            .conditionIfNotEmpty('engineId', '=', filter.engineId)
            .conditionIfNotEmpty('brandId', '=', filter.brandId)
            .conditionIfNotEmpty('status', '>=', filter.status)
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
