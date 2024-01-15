import { Navigate } from "react-router-dom"
import App from "../App"

function PrivateRoutes() {
    const userAuthenticated = true // TODO: Implement authentication service

    return userAuthenticated ? <App /> : <Navigate to='/auth' />
}

export default PrivateRoutes
