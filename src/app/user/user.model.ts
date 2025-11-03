export class User {
    id: string;
    name: string;
    status: number;
    mobile: string;
    email: string;
    username: string;
    password: string;
    createdAt: Date;

    constructor(
        id: string,
        name: string,
        status: number,
        mobile: string,
        email: string,
        username: string,
        password: string,
        createdAt: Date,
    ) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.mobile = mobile;
        this.email = email;
        this.username = username;
        this.password = password;
        this.createdAt = createdAt;
    }
}