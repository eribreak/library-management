import {
    Table,
    TableBodyProps,
    TableCellProps,
    TableColumnHeaderProps,
    TableHeaderProps,
    TableRootProps,
    TableRowProps,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";

export type Column<T> = {
    key: keyof T ;
    header?: React.ReactNode;
    sortable?: boolean;
    headerTextAlign?: string;
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
}
// extends Record<string, string | number | Date>
const CustomTable = <T,>({
    data,
    columns,
    tableColumnHeaderProps,
    tableRowHeaderProps,
    tableCellProps,
    tableHeaderProps,
    tableRowProps,
    tableBodyProps,
    ...tableProps
}: CustomTableProps<T>) => {
    const [sortBy, setSortBy] = useState<keyof T | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

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
        <Table.Root {...tableProps}>
            <Table.Header {...tableHeaderProps}>
                <Table.Row  {...tableRowHeaderProps}>
                    {columns.map((col) => {
                        const isSorted = sortBy === col.key;
                        return (
                            <Table.ColumnHeader
                                key={String(col.key)}
                                {...tableColumnHeaderProps}
                                onClick={() =>
                                    col.sortable && handleSort(col.key)
                                }
                                cursor={col.sortable ? "pointer" : "default"}
                                textAlign={col.headerTextAlign}
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
                {sortedData.map((row, index) => (
                    <Table.Row key={index} {...tableRowProps} >
                        {columns.map((col) => (
                            <Table.Cell
                                {...tableCellProps}
                                key={String(col.key)}
                            >
                                {(() => {
                                    if (col.render) {
                                        return col.render(row);
                                    } else if (row[col.key] instanceof Date) {
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
                ))}
            </Table.Body>
        </Table.Root>
    );
};

export default CustomTable;
