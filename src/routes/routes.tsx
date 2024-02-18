import { createBrowserRouter } from "react-router-dom";
import { Home, NotFound404, Auth, Settings } from "../pages";
import PrivateRoutes from "./privateRoutes";
import { Projects } from "../pages/projects";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <PrivateRoutes />,
        errorElement: <NotFound404 />,
        children: [
            {
                path: "/home",
                element: <Home />
            },
            {
                path: "/projects",
                element: <Projects />
            },
            {
                path: "/settings",
                element: <Settings />
            },
        ]
    },
    {
        path: "/auth",
        element: <Auth />
    }
])