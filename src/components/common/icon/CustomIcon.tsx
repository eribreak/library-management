import { Icon, IconProps } from "@chakra-ui/react"

interface CustomIconProps extends IconProps {
    children: React.ReactNode;
}
export default function CustomIcon({ children, ...rest }: CustomIconProps) {
    return <Icon {...rest}>{children}</Icon>
}