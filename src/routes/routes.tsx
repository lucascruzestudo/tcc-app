import { createBrowserRouter, Navigate } from "react-router-dom";
import { Home, NotFound404, Auth, Settings } from "../pages";
import PrivateRoutes from "./privateRoutes";
import { Projects } from "../pages/projects";
import { NewProject } from "../pages/new-project";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/home" replace />,
        children: []
    },
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
                path: "/new-project",
                element: <NewProject />
            },
            {
                path: "/my-account",
                element: <Settings />
            },
        ]
    },
    {
        path: "/auth",
        element: <Auth />
    }
])