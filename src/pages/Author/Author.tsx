import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import styles from "./Author.module.css";
import SearchInput from "../../components/common/search-input/SearchInput";
import CustomTable from "@/components/common/table/CustomTable";
import { Column } from "@/components/common/table/CustomTable";
import SimplePagination from "../../components/common/pagination/SimplePagination";
import { Toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";
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
import { Box, Center, Spinner } from "@chakra-ui/react";
import ConfirmDialog from "@/components/common/dialog/ConfirmDialog";

const Author: React.FC = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();

    const { authors, loading, pagination } = useSelector(
        (state: RootState) => state.authors
    );

    const pageFromUrl = searchParams.get("page");
    const searchTermFromUrl = searchParams.get("search");
    const idFromUrl = searchParams.get("id");

    const [selectedAuthors, setSelectedAuthors] = useState<number[]>([]);
    const [inputValue, setInputValue] = useState(searchTermFromUrl || "");
    const [searchTerm, setSearchTerm] = useState(searchTermFromUrl || "");
    const [currentPage, setCurrentPage] = useState(
        pageFromUrl ? parseInt(pageFromUrl) : 1
    );
    const [itemsPerPage] = useState(8);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [authorToDelete, setAuthorToDelete] = useState<AuthorType | null>(
        null
    );

    useEffect(() => {
        if (idFromUrl) {
            const authorId = parseInt(idFromUrl);
            const author = authors.find((a) => a.id === authorId);

            if (author) {
                console.log(`Selected author with ID: ${authorId}`);
            }
        }
    }, [idFromUrl, authors]);

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
            fetchAuthors({
                page: 1,
                perPage: itemsPerPage,
                searchTerm: "",
            })
        );
    };

    const handleCreateAuthor = (data: AuthorFormData) => {
        dispatch(createAuthor(data));
    };

    const handleEditSubmit = (data: AuthorFormData) => {
        dispatch(updateAuthor(data));
    };

    const handleDeleteAuthor = (author: AuthorType) => {
        setAuthorToDelete(author);
        setConfirmDialogOpen(true);
        const params = new URLSearchParams(searchParams);
        params.set("id", author.id.toString());
        setSearchParams(params);
    };

    const confirmDelete = () => {
        if (authorToDelete) {
            dispatch(deleteAuthor(authorToDelete.id));
        }
        setConfirmDialogOpen(false);
        const params = new URLSearchParams(searchParams);
        params.delete("id");
        setSearchParams(params);
    };

    const cancelDelete = () => {
        setAuthorToDelete(null);
        setConfirmDialogOpen(false);
        const params = new URLSearchParams(searchParams);
        params.delete("id");
        setSearchParams(params);
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
            fetchAuthors({
                page: 1,
                perPage: itemsPerPage,
                searchTerm: inputValue,
            })
        );
    };

    const renderAuthorName = (author: AuthorType) => (
        <Tooltip content={author.name}>
            <div className={styles.author_name}>{author.name}</div>
        </Tooltip>
    );
    const renderAuthorDescription = (author: AuthorType) => (
        <Tooltip content={author.description}>
            <div className={styles.author_description}>
                {author.description}
            </div>
        </Tooltip>
    );
    const renderActions = (author: AuthorType) => {
        const handleEditClick = () => {
            const params = new URLSearchParams(searchParams);
            params.set("id", author.id.toString());
            setSearchParams(params);
        };

        const handleDialogClose = () => {
            console.log("Author handleDialogClose called");
            const params = new URLSearchParams(searchParams);
            params.delete("id");
            setSearchParams(params);
        };

        return (
            <div className={styles.actions_wrapper}>
                <div onClick={handleEditClick}>
                    <AuthorFormDialog
                        isEdit={true}
                        author={author}
                        onSubmit={(data) => {
                            handleEditSubmit(data);
                            handleDialogClose();
                        }}
                        onDialogClose={handleDialogClose}
                    />
                </div>
                <Tooltip content="Xóa tác giả">
                    <CustomButton
                        onClick={() => handleDeleteAuthor(author)}
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
    const renderAuthorId = (author: AuthorType) => (
        <Tooltip content={`ID: ${author.id}`}>
            <div>{author.id}</div>
        </Tooltip>
    );

    const columns: Column<AuthorType>[] = [
        {
            key: "id",

            header: "ID",
            width: "10%",
            render: (author) => renderAuthorId(author),
        },
        {
            key: "name",
            header: "Tên tác giả",
            width: "100px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: (author) => renderAuthorName(author),
        },
        {
            key: "description",
            header: "Mô tả",
            width: "200px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: (author) => renderAuthorDescription(author),
        },
        {
            key: "actions",
            header: "Thao tác",
            width: "15%",
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

        const params = new URLSearchParams(searchParams);

        if (page > 1) {
            params.set("page", page.toString());
        } else {
            params.delete("page");
        }

        setSearchParams(params);
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
                    onClear={handleClearSearch}
                    placeholder="Tìm kiếm tên tác giả..."
                />
                <AuthorFormDialog
                    isEdit={false}
                    onSubmit={(data) => handleCreateAuthor(data)}
                />
            </Box>

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
                        <CustomTable<AuthorType>
                            tableLayout="fixed"
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

            {confirmDialogOpen && (
                <ConfirmDialog
                    isOpen={confirmDialogOpen}
                    onClose={cancelDelete}
                    onConfirm={confirmDelete}
                    title="Xác nhận xóa"
                    description={`Bạn có chắc chắn muốn xóa tác giả "${authorToDelete?.name}"?`}
                />
            )}
        </div>
    );
};

export default Author;
