import { createContext, useContext, useState, ReactNode, useEffect, Dispatch, SetStateAction } from "react";
import { LocalStorangeUser } from "@utils/types";

interface AuthContextType {
    isAuthenticated: boolean;
    user: LocalStorangeUser | undefined;
    setUser: Dispatch<SetStateAction<LocalStorangeUser | undefined>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<LocalStorangeUser | undefined>();

    useEffect(() => {
        if(!user) return;
        localStorage.setItem('user', JSON.stringify(user));
    }, [user])

    useEffect(() => {
        const userlocalStorage = localStorage.getItem('user');

        if (!userlocalStorage) {
            setIsAuthenticated(false);
            return;
        }

        try {
            const parsedUser = JSON.parse(userlocalStorage);
            setUser(parsedUser);
            setIsAuthenticated(true);
        } catch (error) {
            setIsAuthenticated(false);
            console.error("Auth Provider: ", error);
        }
    }, [])

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
