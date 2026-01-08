export class Feature {
    id: string;
    name: string;
    description: string;
    images: string[];
    createdAt: Date;

    constructor(
        id: string,
        name: string,
        description: string,
        images: string[],
        createdAt: Date,
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.images = images;
        this.createdAt = createdAt;
    }
}
