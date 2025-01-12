import { User } from "./types";

export interface UserResponse {
    success: boolean;
    message: string;
    user: User;
};