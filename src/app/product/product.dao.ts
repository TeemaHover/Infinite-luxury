import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
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
        await this._db.insert(tableName, product, ['id', 'name', 'createdAt']);
    };

    update = async (product: any) => {
        await this._db.update(
            tableName,
            product,
            ['name'],
            [new SqlCondition('id', '=', product.id)],
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
        const sql = `SELECT "id", "name" FROM "${tableName}" ${criteria}
            ${orderBy} limit ${query.limit} offset ${query.skip}`;
        const result = await this._db.select(sql, builder.values);

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
            .conditionIfNotEmpty('username', 'ILIKE', filter.username)
            .conditionIfNotEmpty('role', '=', filter.position)
            .criteria();
        return { builder, criteria };
    }

    async search(filter: any) {
        const builder = new SqlBuilder(filter);
        let selectFields = `"id", "name" as "value"`;

        if (filter.searchByUsername && filter.name) {
            const namePattern = `%${filter.name}%`;
            builder.orConditions([
                new SqlCondition('username', 'ILIKE', namePattern),
                new SqlCondition('name', 'ILIKE', namePattern),
            ]);
            selectFields = `"username" as "id", "name" as "value"`;
        } else if (filter.name) {
            const namePattern = `%${filter.name}%`;
            builder.orConditions([
                new SqlCondition('id', 'ILIKE', namePattern),
                new SqlCondition('name', 'ILIKE', namePattern),
            ]);
        }

        const criteria = builder.criteria();

        return await this._db.select(
            `SELECT ${selectFields} FROM "ADMIN_USERS" ${criteria} limit ${filter.limit} offset ${filter.skip}`,
            builder.values,
        );
    }
}
