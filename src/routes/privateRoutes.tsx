import { Navigate } from "react-router-dom"
import App from "../App"
import { useAuth } from "src/hooks/authContextProvider";

function PrivateRoutes() {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? <App /> : <Navigate to="/auth" />
}

export default PrivateRoutes
