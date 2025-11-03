import { Injectable } from '@nestjs/common';
import { BaseDao } from 'src/base/base.dao';
import { AppDB } from 'src/db/pg/app.db';
import { SqlBuilder, SqlCondition } from 'src/db/pg/sql.builder';
import * as bcrypt from 'bcrypt';

const tableName = 'USERS';

@Injectable()
export class UserDao extends BaseDao {
    constructor(private readonly _db: AppDB) {
        super();
    }

    add = async (product: any) => {
        await this._db.insert(tableName, product, ['id', 'name', 'password', 'createdAt']);
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

    changePassword = async (id: string, password: string) => {
        const saltOrRounds = 1;
        password = await bcrypt.hash(password, saltOrRounds);

        const builder = new SqlBuilder({ password }, ['password']);

        const { cols, indexes } = builder.create();
        const criteria = builder.condition('id', '=', id).criteria();
        await this._db._update(
            `UPDATE "${tableName}" SET (${cols}) = ROW(${indexes}) ${criteria}`,
            builder.values,
        );
    };


    get = async (username: any) => {
        return await this._db.selectOne(
            `SELECT * FROM "${tableName}" WHERE lower("username")= lower($1)`,
            [username],
        );
    };

    countUsername = async (username: any) => {
        return await this._db.count(`SELECT COUNT(*) FROM "${tableName}" WHERE "username" = $1`, [
            username
        ])
    }

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
