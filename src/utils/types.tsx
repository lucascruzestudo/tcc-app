import { UserRole } from "./enums"

/**
 * Users
*/
export type User = {
    username: string,
    role: UserRole;

    profile_picture: string;
    email: string,
    full_name: string,
}