import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "@/App";
import Login from "@/pages/Login/Login";
import Product from "@/pages/Product/Product";
import Dashboard from "@/pages/Dashboard/Dashboard";
import Category from "@/pages/Category/Category";
import User from "@/pages/User/User";
import Author from "@/pages/Author/Author";
import Employee from "@/pages/Employee/Employee";
import Publisher from "@/pages/Publisher/Publisher";
import Order from "@/pages/Order/Order";
import Review from "@/pages/Review/Review";
import Book from "@/pages/Book/Book";
import Error from "@/pages/Error/Error";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <App />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                Component: Dashboard,
            },

            {
                path: "product",
                Component: Product,
            },
            {
                path: "categories-management",
                Component: Category,
            },
            {
                path: "users-management",
                Component: User,
            },
            {
                path: "authors-management",
                Component: Author,
            },
            {
                path: "employees-management",
                Component: Employee,
            },
            {
                path: "publishers-management",
                Component: Publisher,
            },
            {
                path: "orders-management",
                Component: Order,
            },
            {
                path: "dashboard",
                Component: Dashboard,
            },
            {
                path: "reviews-management",
                Component: Review,
            },
            {
                path: "books-management",
                Component: Book,
            },
        ],
    },
    {
        path: "login",
        element: (
            <PublicRoute>
                <Login />
            </PublicRoute>
        ),
    },
    {
        path: "error",
        Component: Error,
    },

    {
        path: "*",
        element: <Navigate to="/error" replace />,
    },
]);

export default router;
