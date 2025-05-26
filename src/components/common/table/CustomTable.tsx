import {
    Box,
    Flex,
    Image,
    Table,
    TableBodyProps,
    TableCellProps,
    TableColumnHeaderProps,
    TableHeaderProps,
    TableRowProps,
    TableRootProps,
} from "@chakra-ui/react";
import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import noDataImage from "@/assets/images/no-data.png";

export type Column<T> = {
    key: keyof T;
    header?: React.ReactNode;
    sortable?: boolean;
    headerTextAlign?: string;
    cellAlign?: string;
    width?: string;
    tableColumnHeaderProps?: TableColumnHeaderProps;
    tableRowHeaderProps?: TableRowProps;
    tableCellProps?: TableCellProps;
    overflow?: "hidden" | "visible" | "scroll" | "auto";
    textOverflow?: "ellipsis" | "clip";
    whiteSpace?: "normal" | "nowrap" | "pre" | "pre-wrap" | "pre-line";
    render?: (row: T) => React.ReactNode;
};

interface CustomTableProps<T> extends Omit<TableRootProps, "columns"> {
    data: T[];
    columns: Column<T>[];
    tableRowHeaderProps?: TableRowProps;
    tableCellProps?: TableCellProps;
    tableColumnHeaderProps?: TableColumnHeaderProps;
    tableHeaderProps?: TableHeaderProps;
    tableRowProps?: TableRowProps;
    tableBodyProps?: TableBodyProps;
    tableLayout: "fixed" | "auto";
    initialSortBy?: keyof T | null;
    initialSortDirection?: "asc" | "desc";
    onSortChange?: (key: keyof T, direction: "asc" | "desc") => void;
    getRowClassName?: (row: T) => string;
}

const CustomTable = <T,>({
    data,
    columns,
    tableColumnHeaderProps,
    tableRowHeaderProps,
    tableCellProps,
    tableHeaderProps,
    tableRowProps,
    tableBodyProps,
    tableLayout,
    initialSortBy = null,
    initialSortDirection = "asc",
    onSortChange,
    getRowClassName,
    ...tableProps
}: CustomTableProps<T>) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const sortByFromUrl = searchParams.get("sortBy") as keyof T | null;
    const sortDirFromUrl = searchParams.get("sortDir") as "asc" | "desc" | null;

    const [sortBy, setSortBy] = useState<keyof T | null>(
        sortByFromUrl || initialSortBy
    );
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
        sortDirFromUrl || initialSortDirection
    );

    useEffect(() => {
        if (onSortChange && sortBy) {
            onSortChange(sortBy, sortDirection);
        }
    }, [sortBy, sortDirection, onSortChange]);

    const handleSort = (key: keyof T) => {
        if (sortBy === key) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortBy(key);
            setSortDirection("asc");
        }
    };

    const sortedData = useMemo(() => {
        if (!sortBy) return data;
        return [...data].sort((a, b) => {
            const aValue = a[sortBy];
            const bValue = b[sortBy];

            if (aValue instanceof Date && bValue instanceof Date) {
                return sortDirection === "asc"
                    ? aValue.getTime() - bValue.getTime()
                    : bValue.getTime() - aValue.getTime();
            }

            if (typeof aValue === "number" && typeof bValue === "number") {
                return sortDirection === "asc"
                    ? aValue - bValue
                    : bValue - aValue;
            }

            return sortDirection === "asc"
                ? String(aValue).localeCompare(String(bValue))
                : String(bValue).localeCompare(String(aValue));
        });
    }, [data, sortBy, sortDirection]);

    return (
        <Table.Root
            zIndex={"1000"}
            {...tableProps}
            style={{ tableLayout: tableLayout, width: "100%" }}
            interactive
        >
            <Table.Header {...tableHeaderProps}>
                <Table.Row {...tableRowHeaderProps}>
                    {columns.map((col) => {
                        const isSorted = sortBy === col.key;
                        return (
                            <Table.ColumnHeader
                                key={String(col.key)}
                                {...tableColumnHeaderProps}
                                {...col.tableColumnHeaderProps}
                                onClick={() =>
                                    col.sortable && handleSort(col.key)
                                }
                                cursor={col.sortable ? "pointer" : "default"}
                                textAlign={col.headerTextAlign}
                                w={col.width}
                                bg="white"
                                overflow={col.overflow}
                                textOverflow={col.textOverflow}
                                whiteSpace={col.whiteSpace}
                            >
                                <span>
                                    {col.header}
                                    {col.sortable && (
                                        <span style={{ marginLeft: 4 }}>
                                            {isSorted
                                                ? sortDirection === "asc"
                                                    ? "▲"
                                                    : "▼"
                                                : ""}
                                        </span>
                                    )}
                                </span>
                            </Table.ColumnHeader>
                        );
                    })}
                </Table.Row>
            </Table.Header>
            <Table.Body {...tableBodyProps}>
                {data.length === 0 ? (
                    <Table.Row>
                        <Table.Cell
                            colSpan={columns.length}
                            textAlign="center"
                            py={10}
                        >
                            <Flex
                                direction="column"
                                align="center"
                                justify="center"
                                w="100%"
                                h={"360px"}
                            >
                                <Image
                                    src={noDataImage}
                                    alt="No data"
                                    objectFit={"contain"}
                                    width="100px"
                                    mb={12}
                                />
                                <Box
                                    fontSize="var(--font-size-large)"
                                    fontWeight={"var(--font-weight-medium)"}
                                    color="var(--black)"
                                >
                                    Không tìm thấy dữ liệu
                                </Box>
                            </Flex>
                        </Table.Cell>
                    </Table.Row>
                ) : (
                    sortedData.map((row, index) => (
                        <Table.Row
                            key={index}
                            {...tableRowProps}
                            className={`table-row ${
                                getRowClassName ? getRowClassName(row) : ""
                            }`}
                        >
                            {columns.map((col) => (
                                <Table.Cell
                                    {...tableCellProps}
                                    {...col.tableCellProps}
                                    key={String(col.key)}
                                    w={col.width}
                                    textAlign={col.cellAlign}
                                    overflow={col.overflow}
                                    textOverflow={col.textOverflow}
                                    whiteSpace={col.whiteSpace}
                                >
                                    {(() => {
                                        if (col.render) {
                                            return col.render(row);
                                        } else if (
                                            row[col.key] instanceof Date
                                        ) {
                                            return (
                                                row[col.key] as Date
                                            ).toLocaleString();
                                        } else {
                                            return String(row[col.key]);
                                        }
                                    })()}
                                </Table.Cell>
                            ))}
                        </Table.Row>
                    ))
                )}
            </Table.Body>
        </Table.Root>
    );
};

export default CustomTable;
