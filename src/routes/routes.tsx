import { Navigate, createBrowserRouter } from "react-router-dom";
import { MyAccount, NotFound404, ProjectProgress } from "../pages";
import { Projects } from "../pages/projects";
import { RetrieveProject } from "../pages/retrieve-project";
import PrivateRoutes from "./privateRoutes";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <PrivateRoutes />,
        errorElement: <NotFound404 />,
        children: [
            {
                path: "/",
                element: <Navigate to="/projects" replace />,
            },
            {
                path: "/project-progress/:projectId",
                element: <ProjectProgress />
            },
            {
                path: "/projects",
                element: <Projects />
            },
            {
                path: "/new-project",
                element: <RetrieveProject />
            },
            {
                path: "/edit-project/:projectId",
                element: <RetrieveProject />
            },
            {
                path: "/my-account",
                element: <MyAccount />
            },
        ]
    },
])