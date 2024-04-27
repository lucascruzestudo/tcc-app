import { useAuth } from "src/hooks/authContextProvider";
import { Auth } from "src/pages";
import App from "../App";

function PrivateRoutes() {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? <App /> :  <Auth />
}

export default PrivateRoutes
