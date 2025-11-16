export class Product {
    id: string;
    name: string;
    status: number;
    transmission: number;
    drive_type: number;
    driver_min_age: number;
    seats: number;
    doors: number;
    img: string;
    luggage_capacity: string;
    brandId: string;
    engineId: string;
    description: string;
    bluetooth: boolean;
    aux: boolean;
    gps: boolean;
    price: number;
    createdAt: Date;

    constructor(
        id: string,
        name: string,
        status: number,
        price: number,
        engineId: string,
        brandId: string,
        transmission: number,
        drive_type: number,
        driver_min_age: number,
        seats: number,
        doors: number,
        luggage_capacity: string,
        description: string,
        bluetooth: boolean,
        aux: boolean,
        img: string,
        gps: boolean,
        createdAt: Date,
    ) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.price = price;
        this.brandId = brandId;
        this.engineId = engineId;
        this.description = description;
        this.transmission = transmission;
        this.drive_type = drive_type;
        this.driver_min_age = driver_min_age;
        this.seats = seats;
        this.doors = doors;
        this.luggage_capacity = luggage_capacity;
        this.bluetooth = bluetooth;
        this.aux = aux;
        this.gps = gps;
        this.img = img;
        this.createdAt = createdAt;
    }
}
