import { Link, LinkProps } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import React from "react";

interface CustomLinkProps extends LinkProps {
    children: React.ReactNode;
    to: string;
    chakraLinkProps?: LinkProps;
    routerLinkProps?: React.ComponentProps<typeof RouterLink>;
}

export default function CustomLink({
    children,
    to,
    chakraLinkProps,
    ...rest
}: CustomLinkProps) {
    return (
        <RouterLink to={to}>
            <Link {...chakraLinkProps} {...rest}>
                {children}
            </Link>
        </RouterLink>
    );
}
