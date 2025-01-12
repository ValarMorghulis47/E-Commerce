import { User } from "./types"

export type UserReducerInitialState = {
    user: User | null;
    loading: boolean;
}