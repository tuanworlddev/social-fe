import { User } from "./user";

export interface friend {
    id: number,
    friend: User,
    status: string,
    createdAt: Date,
    updatedAt: Date
}