import { createBrowserRouter } from "react-router-dom";
import { Home, NotFound404, SignIn, SignUp } from "../pages";
import PrivateRoutes from "./privateRoutes";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <PrivateRoutes />,
        errorElement: <NotFound404 />,
        children: [
            {
                path: '/',
                element: <Home />
            },
        ]
    },
    {
        path: '/sign-in',
        element: <SignIn />
    },
    {
        path: '/sign-up',
        element: <SignUp />
    },
])