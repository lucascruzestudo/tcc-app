export type User = {
    name: string,
    email: string;
    password: string;
}


export type UpdateUser = {
    name: string,
    email: string;
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}