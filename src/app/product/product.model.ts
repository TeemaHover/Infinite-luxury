export class Product {
    id: string;
    name: string;
    status: number;
    engine: string;
    transmission: number;
    driveType: number;
    driverMinAge: number;
    seats: number;
    doors: number;
    img: string;
    luggageCapacity: string;
    bluetooth: boolean;
    aux: boolean;
    gps: boolean;
    price: number;
    createdAt: Date;

    constructor(
        id: string,
        name: string,
        status: number,
        engine: string,
        transmission: number,
        driveType: number,
        driverMinAge: number,
        seats: number,
        doors: number,
        luggageCapacity: string,
        bluetooth: boolean,
        aux: boolean,
        img: string,
        gps: boolean,
        price: number,
        createdAt: Date,
    ) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.engine = engine;
        this.transmission = transmission;
        this.driveType = driveType;
        this.driverMinAge = driverMinAge;
        this.seats = seats;
        this.doors = doors;
        this.luggageCapacity = luggageCapacity;
        this.bluetooth = bluetooth;
        this.aux = aux;
        this.gps = gps;
        this.img = img;
        this.createdAt = createdAt;
        this.price = price;
    }
}
