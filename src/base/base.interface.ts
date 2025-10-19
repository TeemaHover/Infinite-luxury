export interface Meta {
    totalCount: number;
    pageCount: number;
    currentPage: number;
    perPage: number;
}

export const EntityStatus = {
    Active: 10,
    Suspended: 20,
    Deleted: 30,
};
