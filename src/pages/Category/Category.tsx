import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import styles from "./Category.module.css";
import SearchInput from "../../components/common/search-input/SearchInput";
import CustomTable from "@/components/common/table/CustomTable";
import { Column } from "@/components/common/table/CustomTable";
import SimplePagination from "../../components/common/pagination/SimplePagination";
import { Toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";
import deleteIcon from "@/assets/images/images/delete-icon.svg";
import clsx from "clsx";
import {
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    Category as CategoryType,
    CategoryFormData,
    resetCategoryState,
} from "@/store/slices/categorySlice";
import { RootState } from "@/store/store";
import { CategoryFormDialog } from "@/components/common/dialog/CategoryFormDialog";
import CustomButton from "@/components/common/button/CustomButton";
import { Box, Center, Spinner } from "@chakra-ui/react";
import ConfirmDialog from "@/components/common/dialog/ConfirmDialog";

const Category: React.FC = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();

    const { categories, loading, pagination } = useSelector(
        (state: RootState) => state.categories
    );

    const pageFromUrl = searchParams.get("page");
    const searchTermFromUrl = searchParams.get("search");
    const idFromUrl = searchParams.get("id");

    const [inputValue, setInputValue] = useState(searchTermFromUrl || "");
    const [searchTerm, setSearchTerm] = useState(searchTermFromUrl || "");
    const [currentPage, setCurrentPage] = useState(
        pageFromUrl ? parseInt(pageFromUrl) : 1
    );
    const [itemsPerPage] = useState(8);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] =
        useState<CategoryType | null>(null);

    useEffect(() => {
        dispatch(resetCategoryState());
    }, [dispatch]);

    const renderCategoryName = (category: CategoryType) => (
        <Tooltip content={category.name || "N/A"}>
            <div className={styles.category_name}>{category.name || "N/A"}</div>
        </Tooltip>
    );
    const renderCategoryDescription = (category: CategoryType) => (
        <Tooltip content={category.description || "N/A"}>
            <div className={styles.category_description}>
                {category.description || "N/A"}
            </div>
        </Tooltip>
    );
    const renderCategoryActions = (category: CategoryType) => {
        const handleEditClick = () => {
            const params = new URLSearchParams(searchParams);
            params.set("id", category.id.toString());
            setSearchParams(params);
        };

        const handleDialogClose = () => {
            const params = new URLSearchParams(searchParams);
            params.delete("id");
            setSearchParams(params);
        };

        return (
            <div className={styles.category_table__action_buttons}>
                <div onClick={handleEditClick}>
                    <CategoryFormDialog
                        isEdit={true}
                        category={category}
                        onSubmit={(data) => {
                            handleEditSubmit(data);
                            handleDialogClose();
                        }}
                        onDialogClose={handleDialogClose}
                    />
                </div>
                <Tooltip content="Xóa danh mục">
                    <CustomButton
                        onClick={() => handleDeleteCategory(category)}
                        className={clsx(
                            styles.action_button,
                            styles.action_button__right
                        )}
                    >
                        <img src={deleteIcon} alt="Delete" />
                    </CustomButton>
                </Tooltip>
            </div>
        );
    };

    const columns: Column<CategoryType>[] = [
        {
            key: "id",
            header: "ID",
            width: "10%",
            render: (category) => category.id,
        },
        {
            key: "name",
            header: "Tên danh mục",
            width: "15%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: (category) => renderCategoryName(category),
        },
        {
            key: "description",
            header: "Mô tả",
            width: "65%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: (category) => renderCategoryDescription(category),
        },
        {
            key: "actions",
            header: "Thao tác",
            width: "15%",
            headerTextAlign: "center",
            render: (category) => renderCategoryActions(category),
        },
    ];

    useEffect(() => {
        dispatch(
            fetchCategories({
                page: currentPage,
                perPage: itemsPerPage,
                searchTerm,
            })
        );
    }, [dispatch, currentPage, itemsPerPage, searchTerm]);

    const handleInputChange = (term: string) => {
        setInputValue(term);
    };

    const handleClearSearch = () => {
        setInputValue("");
        setSearchTerm("");
        setCurrentPage(1);

        const params = new URLSearchParams();
        if (idFromUrl) {
            params.set("id", idFromUrl);
        }
        setSearchParams(params);

        dispatch(
            fetchCategories({
                page: 1,
                perPage: itemsPerPage,
                searchTerm: "",
            })
        );
    };

    const handleSearch = () => {
        setSearchTerm(inputValue);
        setCurrentPage(1);

        const params = new URLSearchParams();

        if (inputValue) {
            params.set("search", inputValue);
        }

        setSearchParams(params);

        dispatch(
            fetchCategories({
                page: 1,
                perPage: itemsPerPage,
                searchTerm: inputValue,
            })
        );
    };

    const handleAddSubmit = (data: CategoryFormData) => {
        dispatch(createCategory(data));
    };

    const handleEditSubmit = (data: CategoryFormData) => {
        dispatch(updateCategory(data));
    };

    const handleDeleteCategory = (category: CategoryType) => {
        setCategoryToDelete(category);
        setConfirmDialogOpen(true);
        const params = new URLSearchParams(searchParams);
        params.set("id", category.id.toString());
        setSearchParams(params);
    };

    const confirmDelete = () => {
        if (categoryToDelete) {
            dispatch(deleteCategory(categoryToDelete.id));
            setCategoryToDelete(null);
        }
        setConfirmDialogOpen(false);
        const params = new URLSearchParams(searchParams);
        params.delete("id");
        setSearchParams(params);
    };

    const cancelDelete = () => {
        setCategoryToDelete(null);
        setConfirmDialogOpen(false);
        const params = new URLSearchParams(searchParams);
        params.delete("id");
        setSearchParams(params);
    };

    const totalPages = pagination.total_pages;
    const startIndex = (pagination.current_page - 1) * pagination.per_page + 1;
    const endIndex = Math.min(
        startIndex + pagination.per_page - 1,
        pagination.total
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);

        const params = new URLSearchParams(searchParams);

        if (page > 1) {
            params.set("page", page.toString());
        } else {
            params.delete("page");
        }

        setSearchParams(params);
    };

    return (
        <div className={styles.content_container}>
            <Toaster />
            <Box className={styles.category_title}>Quản lý Thể loại</Box>

            <div className={styles.search_wrapper}>
                <SearchInput
                    placeholder="Tìm kiếm bằng tên danh mục"
                    value={inputValue}
                    onChange={handleInputChange}
                    onSearch={handleSearch}
                    onClear={handleClearSearch}
                />
                <CategoryFormDialog
                    isEdit={false}
                    onSubmit={(data) => handleAddSubmit(data)}
                />
            </div>

            {loading ? (
                <Center h="400px">
                    <Spinner size="xl" color="var(--primary-color)" />
                </Center>
            ) : (
                <>
                    <Box
                        borderRadius={"8px"}
                        overflow={"hidden"}
                        boxShadow={"0 0 10px 0 rgba(0, 0, 0, 0.1)"}
                    >
                        <CustomTable<CategoryType>
                            tableLayout="fixed"
                            data={categories}
                            columns={columns}
                        />
                    </Box>

                    <div className={styles.pagination_wrapper}>
                        <SimplePagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            itemsInfo={{
                                startIndex,
                                endIndex,
                                totalItems: pagination.total,
                            }}
                        />
                    </div>
                </>
            )}

            {confirmDialogOpen && (
                <ConfirmDialog
                    isOpen={confirmDialogOpen}
                    onConfirm={confirmDelete}
                    onClose={cancelDelete}
                    title="Xác nhận xóa"
                    description={`Bạn có chắc chắn muốn xóa danh mục "${categoryToDelete?.name}"?`}
                />
            )}
        </div>
    );
};

export default Category;
