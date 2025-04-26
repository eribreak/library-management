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
    const columns: Column<CategoryType>[] = [
        {
            key: "name",
            header: "Tên danh mục",
            render: (category) => (
                <div className={styles.category_name}>
                    {category?.name || "N/A"}
                </div>
            ),
        },
        {
            key: "description",
            header: "Mô tả",
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
    const { categories, loading } = useSelector(
        (state: RootState) => state.categories
    );

    const [inputValue, setInputValue] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [displayData, setDisplayData] = useState<CategoryType[]>([]);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        dispatch(fetchCategories(searchTerm));
    }, [dispatch, searchTerm]);

    useEffect(() => {
        if (categories.length > 0) {
            setTotalItems(categories.length);

            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = Math.min(
                startIndex + itemsPerPage,
                categories.length
            );
            setDisplayData(categories.slice(startIndex, endIndex));
        } else {
            setDisplayData([]);
            setTotalItems(0);
        }
    }, [currentPage, categories, itemsPerPage]);

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
        if (confirm("Are you sure you want to delete this category?")) {
            dispatch(deleteCategory(category.id));
        }
    };

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex =
        categories.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className={styles.content_container}>
            <Toaster />

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

            {loading ? (
                <div className={styles.loading}>Đang tải...</div>
            ) : (
                <>
                    <Box borderRadius={"8px"} overflow={"hidden"}>
                        <CustomTable<CategoryType>
                            data={displayData}
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
                                totalItems,
                            }}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default Category;
