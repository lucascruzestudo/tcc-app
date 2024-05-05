import {
    AuthResetPassword,
    ListProjects,
    ListProjectsFinalApproval,
    MyAccount,
    NotFound404,
    ProjectProgress,
    ProjectProgressFinalApproval,
    RetrieveProject
} from "@pages/index";
import { Navigate, createBrowserRouter } from "react-router-dom";
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
                path: "/projects/final-approval",
                element: <ListProjectsFinalApproval />
            },
            {
                path: "/project-final-approval/:projectId",
                element: <ProjectProgressFinalApproval />
            },
            {
                path: "/projects",
                element: <ListProjects />
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
    {
        path: "/reset-password",
        element: <AuthResetPassword />,
    },
    {
        path: "/not-found",
        element: <NotFound404 />,
    }
])