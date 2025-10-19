import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { BaseDao } from 'src/base/base.dao';
import { AppDB } from 'src/db/pg/app.db';
import { SqlBuilder, SqlCondition } from 'src/db/pg/sql.builder';

const tableName = 'ADMIN_USERS';

@Injectable()
export class AdminUserDao extends BaseDao {
    constructor(private readonly _db: AppDB) {
        super();
    }

    add = async (user: any) => {
        await this._db.insert(tableName, user, [
            'id',
            'name',
            'role',
            'username',
            'password',
            'createdAt',
        ]);
    };

    update = async (user: any) => {
        await this._db.update(
            tableName,
            user,
            ['name', 'username', 'role'],
            [new SqlCondition('id', '=', user.id)],
        );
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

    getById = async (id: any) => {
        return await this._db.selectOne(
            `SELECT * FROM "${tableName}" WHERE "id"=$1`,
            [id],
        );
    };

    getAdminUserInfo = async (id: any) => {
        return await this._db.selectOne(
            `SELECT "id", "name", "username", "roles","departmentId","meta" FROM "${tableName}" WHERE "id"=$1`,
            [id],
        );
    };

    totalCount = async (filter) => {
        const { builder, criteria } = this.buildCriteria(filter);
        return await this._db.count(
            `SELECT COUNT(1) FROM "${tableName}" ${criteria}`,
            builder.values,
        );
    };

    list = async (query) => {
        const { builder, criteria } = this.buildCriteria(query);

        const orderBy = this.orderBy(query.column, query.orderDirection, [
            'createdAt',
            'id',
            'name',
        ]);

        return await this._db.select(
            `SELECT "id", "name", "username", "roles", "position","departmentId","meta" FROM "${tableName}" ${criteria}
            ${orderBy} limit ${query.limit} offset ${query.skip}`,
            builder.values,
        );
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

    get = async (username: any) => {
        return await this._db.selectOne(
            `SELECT * FROM "${tableName}" WHERE lower("username")= lower($1)`,
            [username],
        );
    };
}
