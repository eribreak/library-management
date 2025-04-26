import { FC, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface PublicRouteProps {
    children: ReactNode;
    redirectTo?: string;
}

const PublicRoute: FC<PublicRouteProps> = ({
    children,
    redirectTo = "/dashboard",
}) => {
    const location = useLocation();
    const isAuthenticated = !!localStorage.getItem("accessToken");
    const from = location.state?.from?.pathname || redirectTo;

    if (isAuthenticated) {
        return <Navigate to={from} replace />;
    }

    return <>{children}</>;
};

export default PublicRoute;
