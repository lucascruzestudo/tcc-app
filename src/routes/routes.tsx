import { createBrowserRouter } from "react-router-dom";
import { Home, NotFound404, Auth, User } from "../pages";
import PrivateRoutes from "./privateRoutes";
import { Projects } from "../pages/projects";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <PrivateRoutes />,
        errorElement: <NotFound404 />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/projects",
                element: <Projects />
            },
            {
                path: "/user",
                element: <User />
            },
        ]
    },
    {
        path: "/auth",
        element: <Auth />
    }
])