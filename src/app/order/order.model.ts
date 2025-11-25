export class Order {
    id: string;
    status: number;
    productId: string;
    userId: string;
    mobile: string;
    email: string;
    startDate: Date;
    endDate: Date;
    description:string;
    username:string;
    meta: any;
    createdAt: Date;

    constructor(
        id: string,
        status: number,
        productId: string,
        username: string,
        userId: string,
        mobile: string,
        email: string,
        startDate: Date,
        endDate: Date,
        description:string,
        meta: any,
        createdAt: Date,
    ) {
        this.id = id;
        this.status = status;
        this.productId = productId;
        this.username = username;
        this.userId = userId;
        this.mobile = mobile;
        this.email = email;
        this.startDate = startDate;
        this.endDate = endDate;
        this.description = description;
        this.meta = meta;
        this.createdAt = createdAt;
    }
}