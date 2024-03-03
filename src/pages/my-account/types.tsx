export type UpdateUser = {
    username: string,

    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;

    profile_picture?: string;
    email?: string;
    full_name?: string,
}