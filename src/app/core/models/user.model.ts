import { PaginatedResponse } from "./paginated-response.model";

export interface User {
    id: string;
    fname: string;
    lname: string;
    username: string;
    password?: string;
    avatar?: string;
}

export type PaginatedUsers = PaginatedResponse<User>;