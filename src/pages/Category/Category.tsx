import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Category.module.css";
import SearchInput from "../../components/common/search-input/SearchInput";
import { CustomTable } from "@/components/common/table";
import { Column } from "@/components/common/table/CustomTable";
import SimplePagination from "../../components/common/pagination/SimplePagination";
import { Toaster } from "@/components/ui/toaster";
import deleteIcon from "@/assets/images/images/delete-icon.svg";
import clsx from "clsx";
import {
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    Category as CategoryType,
    CategoryFormData,
} from "@/store/slices/categorySlice";
import { RootState } from "@/store/store";
import { CategoryFormDialog } from "@/components/common/dialog/CategoryFormDialog";
import CustomButton from "@/components/common/button/CustomButton";
import { Box } from "@chakra-ui/react";

const Category: React.FC = () => {
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

    const columns: Column<CategoryType>[] = [
        {
            key: "select",
            header: "",
            width: "50px",
            render: (category) => (
                <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={(e) => {
                        if (e.target.checked) {
                            setSelectedCategories([
                                ...selectedCategories,
                                category.id,
                            ]);
                        } else {
                            setSelectedCategories(
                                selectedCategories.filter(
                                    (id) => id !== category.id
                                )
                            );
                        }
                    }}
                    className={styles.category_checkbox}
                />
            ),
        },
        {
            key: "name",
            header: "Tên danh mục",
            width: "15%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: (category) => (
                <div className={styles.category_name}>
                    {category?.name || "N/A"}
                </div>
            ),
        },
        {
            key: "description",
            header: "Mô tả",
            width: "65%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: (category) => (
                <div className={styles.category_description}>
                    {category?.description || "N/A"}
                </div>
            ),
        },
        {
            key: "actions",
            header: "Thao tác",
            headerTextAlign: "center",
            render: (category) => (
                <div className={styles.category_table__action_buttons}>
                    <CategoryFormDialog
                        isEdit={true}
                        category={category}
                        onSubmit={(data) => handleEditSubmit(data)}
                    />
                    <CustomButton
                        onClick={() => handleDeleteCategory(category)}
                        className={clsx(
                            styles.action_button,
                            styles.action_button__right
                        )}
                    >
                        <img src={deleteIcon} alt="Delete" />
                    </CustomButton>
                </div>
            ),
        },
    ];

    const dispatch = useDispatch();
    const { categories, loading, pagination } = useSelector(
        (state: RootState) => state.categories
    );

    const [inputValue, setInputValue] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);

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

    const handleSearch = () => {
        setSearchTerm(inputValue);
        setCurrentPage(1);
    };

    const handleAddSubmit = (data: CategoryFormData) => {
        dispatch(createCategory(data));
    };

    const handleEditSubmit = (data: CategoryFormData) => {
        dispatch(updateCategory(data));
    };

    const handleDeleteCategory = (category: CategoryType) => {
        if (window.confirm("Bạn có muốn xóa danh mục này không?")) {
            dispatch(deleteCategory(category.id));
        }
    };

    const totalPages = pagination.total_pages;
    const startIndex = (pagination.current_page - 1) * pagination.per_page + 1;
    const endIndex = Math.min(
        startIndex + pagination.per_page - 1,
        pagination.total
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleBulkDelete = () => {
        if (window.confirm("Bạn có muốn xóa những danh mục đã chọn không?")) {
            selectedCategories.forEach((id) => {
                dispatch(deleteCategory(id));
            });
            setSelectedCategories([]);
        }
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
                />
                <CategoryFormDialog
                    isEdit={false}
                    onSubmit={(data) => handleAddSubmit(data)}
                />
            </div>

            <CustomButton
                onClick={handleBulkDelete}
                disabled={selectedCategories.length === 0}
                className={styles.bulk_delete_button}
            >
                Xóa nhiều
            </CustomButton>

            {loading ? (
                <div className={styles.loading}>Đang tải...</div>
            ) : (
                <>
                    <Box borderRadius={"8px"} overflow={"hidden"}>
                        <CustomTable<CategoryType>
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
        </div>
    );
};

export default Category;
