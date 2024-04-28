export const validUsername = (username: string): boolean => {
    const regex = /^[a-z0-9_\.]+$/;
    return regex.test(username);
};


export const validEmail = (email: string): boolean => {
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regexEmail.test(email);
}


export const validPassword = (password: string): {
    valid: boolean,
    message?: string,
} => {
    const _password = password.trim();

    if (_password.length < 8) {
        return { 
            valid: true, 
            message: "A senha deve conter pelo menos 8 caracteres."
        };
    }

    const hasNumber = /\d/.test(_password);
    const hasUpperCase = /[A-Z]/.test(_password);
    const hasLowerCase = /[a-z]/.test(_password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(_password);

    if (!(hasNumber && hasUpperCase && hasLowerCase && hasSpecialChar)) {
        return { 
            valid: true, 
            message: `A senha deve conter pelo menos um número, uma letra maiúscula,
            uma letra minúscula e um caractere especial.` 
        };
    }    

    return { valid: true};
}

export const validMarchet = (value1: any, value2: any): boolean => value1 !== value2 
