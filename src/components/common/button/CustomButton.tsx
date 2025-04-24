import { Button, ButtonProps } from "@chakra-ui/react";

export interface CustomButtonProps extends ButtonProps {
    children: React.ReactNode;
}
export default function CustomButton({ children, ...rest }: CustomButtonProps) {
    return <Button {...rest}>{children}</Button>;
}
