import { List, ListRootProps } from "@chakra-ui/react";
import CustomIcon from "../icon/CustomIcon";
import React from "react";

export type Item = {
    icon?: React.ReactNode;
    content: React.ReactNode;
}

interface CustomListProps extends ListRootProps {
    items: Item[];
    gap?: string;
    imgWidth?: string;
    imgHeight?: string;
}

function CustomList({ items = [], gap = "2",imgHeight,imgWidth, ...restProps }: CustomListProps) {
    return (
        <List.Root gap={gap} {...restProps}>
            {items.map((item, index) => (
                <List.Item key={index}>
                    {item.icon ? (
                        <List.Indicator asChild>
                            <CustomIcon w={imgWidth} h={imgHeight}>{item.icon}</CustomIcon>
                        </List.Indicator>
                    ) : null}
                    {item.content}
                </List.Item>
            ))}
        </List.Root>
    );
}

export default CustomList;
