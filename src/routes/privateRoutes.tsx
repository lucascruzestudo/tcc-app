import App from "../App"
import { useAuth } from "src/hooks/authContextProvider";
import { Auth } from "src/pages";

function PrivateRoutes() {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? <App /> :  <Auth />
}

export default PrivateRoutes
