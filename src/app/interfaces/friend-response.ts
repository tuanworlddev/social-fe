import { UserResponse } from "./user-response";

export interface FriendResponse {
    id: number,
    friend: UserResponse,
    status: string,
    createdAt: Date,
    updatedAt: Date
}