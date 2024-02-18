export const validUsername = (username: string): boolean => {
    const regex = /^[a-z0-9_\.]+$/;
    return regex.test(username);
};


export const validEmail = (email: string): boolean => {
    const regex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i;
    return regex.test(email);
}


export const validPassword = (password: string): {
    valid: boolean,
    message?: string,
} => {
    const _password = password.trim();

    if (_password.length < 8) {
        return { 
            valid: true, 
            message: "The password must contain at least 8 characters." 
        };
    }

    const hasNumber = /\d/.test(_password);
    const hasUpperCase = /[A-Z]/.test(_password);
    const hasLowerCase = /[a-z]/.test(_password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(_password);

    if (!(hasNumber && hasUpperCase && hasLowerCase && hasSpecialChar)) {
        return { 
            valid: true, 
            message: `Password must contain at least one number, one uppercase letter, 
                one lowercase letter, and one special character.` 
        };
    }    

    return { valid: true};
}

export const validMarchet = (value1: any, value2: any): boolean => value1 !== value2 
