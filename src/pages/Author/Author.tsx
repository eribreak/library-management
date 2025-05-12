import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Author.module.css";
import SearchInput from "../../components/common/search-input/SearchInput";
import { CustomTable } from "@/components/common/table";
import { Column } from "@/components/common/table/CustomTable";
import SimplePagination from "../../components/common/pagination/SimplePagination";
import { Toaster } from "@/components/ui/toaster";
import deleteIcon from "@/assets/images/images/delete-icon.svg";
import clsx from "clsx";
import {
    fetchAuthors,
    createAuthor,
    updateAuthor,
    deleteAuthor,
    Author as AuthorType,
    AuthorFormData,
} from "@/store/slices/authorSlice";
import { RootState } from "@/store/store";
import AuthorFormDialog from "@/components/common/dialog/AuthorFormDialog";
import CustomButton from "@/components/common/button/CustomButton";
import { Box } from "@chakra-ui/react";
import { MdDeleteSweep } from "react-icons/md";

const Author: React.FC = () => {
    const dispatch = useDispatch();
    const { authors, loading, pagination } = useSelector(
        (state: RootState) => state.authors
    );

    const [selectedAuthors, setSelectedAuthors] = useState<number[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);

    useEffect(() => {
        dispatch(
            fetchAuthors({
                page: currentPage,
                perPage: itemsPerPage,
                searchTerm,
            })
        );
        setSelectedAuthors([]);
    }, [dispatch, currentPage, itemsPerPage, searchTerm]);

    const handleInputChange = (term: string) => {
        setInputValue(term);
    };

    const handleCreateAuthor = (data: AuthorFormData) => {
        dispatch(createAuthor(data));
    };

    const handleEditSubmit = (data: AuthorFormData) => {
        dispatch(updateAuthor(data));
    };

    const handleDeleteAuthor = (author: AuthorType) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa "${author.name}"?`)) {
            dispatch(deleteAuthor(author.id));
        }
    };

    const handleSearch = () => {
        setSearchTerm(inputValue);
        setCurrentPage(1);
    };

    const handleBulkDelete = () => {
        if (
            window.confirm("Bạn có chắc chắn muốn xóa những tác giả đã chọn?")
        ) {
            selectedAuthors.forEach((id) => {
                dispatch(deleteAuthor(id));
            });
            setSelectedAuthors([]);
        }
    };

    const headerCheckbox = (
        <input
            type="checkbox"
            checked={
                authors.length > 0 && selectedAuthors.length === authors.length
            }
            onChange={(e) => {
                if (e.target.checked) {
                    const allIds = authors.map((author) => author.id);
                    setSelectedAuthors(allIds);
                } else {
                    setSelectedAuthors([]);
                }
            }}
            className={styles.author_checkbox}
        />
    );

    const renderCheckbox = (author: AuthorType) => (
        <input
            type="checkbox"
            checked={selectedAuthors.includes(author.id)}
            onChange={(e) => {
                if (e.target.checked) {
                    setSelectedAuthors([...selectedAuthors, author.id]);
                } else {
                    setSelectedAuthors(
                        selectedAuthors.filter((id) => id !== author.id)
                    );
                }
            }}
            className={styles.author_checkbox}
        />
    );
    const renderAuthorName = (author: AuthorType) => (
        <div className={styles.author_name}>{author.name}</div>
    );
    const renderAuthorDescription = (author: AuthorType) => (
        <div className={styles.author_description}>{author.description}</div>
    );
    const renderActions = (author: AuthorType) => {
        const authorId = `author-${author.id}`;
        return (
            <div className={styles.actions_wrapper}>
                <AuthorFormDialog
                    key={`edit-${authorId}`}
                    isEdit={true}
                    author={author}
                    onSubmit={(data) => handleEditSubmit(data)}
                />
                <CustomButton
                    key={`delete-${authorId}`}
                    onClick={() => handleDeleteAuthor(author)}
                    className={clsx(
                        styles.action_button,
                        styles.action_button__right
                    )}
                >
                    <img src={deleteIcon} alt="Delete" />
                </CustomButton>
            </div>
        );
    };
    const renderAuthorId = (author: AuthorType) => <div>{author.id}</div>;

    const columns: Column<AuthorType>[] = [
        {
            key: "select",
            header: headerCheckbox,
            width: "50px",
            render: (author) => renderCheckbox(author),
        },
        {
            key: "id",
            header: "ID",
            width: "10%",
            render: (author) => renderAuthorId(author),
        },
        {
            key: "name",
            header: "Tên tác giả",
            width: "20%",
            render: (author) => renderAuthorName(author),
        },
        {
            key: "description",
            header: "Mô tả",
            width: "50%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: (author) => renderAuthorDescription(author),
        },
        {
            key: "actions",
            header: "Thao tác",
            headerTextAlign: "center",
            render: (author) => renderActions(author),
        },
    ];

    const totalItems = pagination?.total || 0;
    const totalPages =
        pagination?.total_pages || Math.ceil(totalItems / itemsPerPage);
    const startIndex =
        ((pagination?.current_page || 1) - 1) *
            (pagination?.per_page || itemsPerPage) +
        1;
    const endIndex = Math.min(
        startIndex + (pagination?.per_page || itemsPerPage) - 1,
        totalItems
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <Toaster />
            <Box className={styles.author_title}>Quản lý Tác giả</Box>
            <Box className={styles.search_wrapper}>
                <SearchInput
                    value={inputValue}
                    onChange={handleInputChange}
                    onSearch={handleSearch}
                    placeholder="Tìm kiếm tên tác giả..."
                />
                <AuthorFormDialog
                    isEdit={false}
                    onSubmit={(data) => handleCreateAuthor(data)}
                />
            </Box>

            <Box display="flex" gap={2}>
                <CustomButton
                title="Xóa nhiều"
                    onClick={handleBulkDelete}
                    disabled={selectedAuthors.length === 0}
                    className={styles.bulk_delete_button}
                >
                    <MdDeleteSweep />
                </CustomButton>

                {selectedAuthors.length > 0 && (
                    <CustomButton
                    
                        onClick={() => setSelectedAuthors([])}
                        bg="gray.500"
                        _hover={{ bg: "gray.600" }}
                    >
                        Bỏ chọn tất cả ({selectedAuthors.length})
                    </CustomButton>
                )}
            </Box>

            {loading ? (
                <div className={styles.loading}>Đang tải...</div>
            ) : (
                <>
                    <Box borderRadius={"8px"} overflow={"hidden"}>
                        <CustomTable<AuthorType>
                            data={authors}
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

export default Author;
