export interface User {
    id: number,
    email: string,
    fullName: string,
    avatar: string,
    role: string,
    status: string,
    createdAt?: Date,
    updatedAt?: Date
}