import { UserRole } from "./enums"

/**
 * Users
*/
export type LocalStorangeUser = {
    id: string
    full_name: string,
    username: string,
    email: string,
    role: UserRole;
    profile_picture: string;
    access_token: string;
    refresh_token: string;
}