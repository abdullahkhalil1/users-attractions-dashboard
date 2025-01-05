import { PaginatedResponse } from "./paginated-response.model";

export interface Attraction {
    id: string;
    name: string;
    coverimage: string;
    detail: string;
    latitude: number;
    longitude: number;
}

export type PaginatedAttractions = PaginatedResponse<Attraction>;