import { UserRole } from "./enums"

/**
 * Users
*/
export type User = {
    username: string,
    password: string;
    role: UserRole;

    profile_picture?: string;
    email?: string,
    full_name?: string,
}