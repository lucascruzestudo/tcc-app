import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProjectProgress, NotFound404, MyAccount } from "../pages";
import PrivateRoutes from "./privateRoutes";
import { Projects } from "../pages/projects";
import { NewProject } from "../pages/new-project";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <PrivateRoutes />,
        errorElement: <NotFound404 />,
        children: [
            {
                path: "/",
                element: <Navigate to="/project-progress" replace />,
            },
            {
                path: "/project-progress",
                element: <ProjectProgress />
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
                element: <MyAccount />
            },
        ]
    },
])