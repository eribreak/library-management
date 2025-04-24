import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "@/App";
import Login from "@/pages/Login/Login";

import Dashboard from "@/pages/Dashboard/Dashboard";

const router = createBrowserRouter([
    {
        path: "/",
        Component: App,
        children: [
            {
                index: true,
                Component: Dashboard,
            },
            {
                path: "login",
                Component: Login,
            },
        ],
    },
    {
        path: "*",
        element: <Navigate to="/" replace />,
    },
]);

export default router;
