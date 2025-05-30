import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import styles from "./Publisher.module.css";
import SearchInput from "../../components/common/search-input/SearchInput";
import CustomTable from "@/components/common/table/CustomTable";
import { Column } from "@/components/common/table/CustomTable";
import SimplePagination from "../../components/common/pagination/SimplePagination";
import { Toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";
import deleteIcon from "@/assets/images/images/delete-icon.svg";
import clsx from "clsx";
import {
    fetchPublishers,
    createPublisher,
    updatePublisher,
    deletePublisher,
    Publisher as PublisherType,
    PublisherFormData,
    resetPublisherState,
} from "@/store/slices/publisherSlice";
import { RootState } from "@/store/store";
import PublisherFormDialog from "@/components/common/dialog/PublisherFormDialog";
import CustomButton from "@/components/common/button/CustomButton";
import { Box, Center, Spinner } from "@chakra-ui/react";
import ConfirmDialog from "@/components/common/dialog/ConfirmDialog";

const Publisher: React.FC = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();

    const { publishers, loading, pagination } = useSelector(
        (state: RootState) => state.publishers
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
    const [publisherToDelete, setPublisherToDelete] =
        useState<PublisherType | null>(null);

    useEffect(() => {
        dispatch(resetPublisherState());
    }, [dispatch]);

    useEffect(() => {
        dispatch(
            fetchPublishers({
                page: currentPage,
                perPage: itemsPerPage,
                searchTerm,
            })
        );
    }, [dispatch, searchTerm, currentPage, itemsPerPage]);

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
            fetchPublishers({
                page: 1,
                perPage: itemsPerPage,
                searchTerm: "",
            })
        );
    };

    const handleCreatePublisher = (data: PublisherFormData) => {
        dispatch(createPublisher(data));
    };

    const handleEditSubmit = (data: PublisherFormData) => {
        dispatch(updatePublisher(data));
    };

    const handleDeletePublisher = (publisher: PublisherType) => {
        setPublisherToDelete(publisher);
        setConfirmDialogOpen(true);

        const params = new URLSearchParams(searchParams);
        params.set("id", publisher.id.toString());
        setSearchParams(params);
    };

    const confirmDelete = () => {
        if (publisherToDelete) {
            dispatch(deletePublisher(publisherToDelete.id));
        }
        setConfirmDialogOpen(false);

        const params = new URLSearchParams(searchParams);
        params.delete("id");
        setSearchParams(params);
    };

    const cancelDelete = () => {
        setPublisherToDelete(null);
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
            fetchPublishers({
                page: 1,
                perPage: itemsPerPage,
                searchTerm: inputValue,
            })
        );
    };

    const columns: Column<PublisherType>[] = [
        {
            key: "id",
            width: "10%",
            header: "ID",
            render: (publisher) => (
                <Tooltip content={`ID: ${publisher.id}`}>
                    <div>{publisher.id}</div>
                </Tooltip>
            ),
        },
        {
            key: "name",
            width: "25%",
            header: "Tên nhà xuất bản",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: (publisher) => (
                <Tooltip content={publisher.name}>
                    <div className={styles.publisher_name}>
                        {publisher.name}
                    </div>
                </Tooltip>
            ),
        },
        {
            key: "description",
            width: "50%",
            header: "Mô tả",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: (publisher) => (
                <Tooltip content={publisher.description}>
                    <div className={styles.publisher_description}>
                        {publisher.description}
                    </div>
                </Tooltip>
            ),
        },
        {
            key: "actions",
            header: "Thao tác",
            width: "15%",
            headerTextAlign: "center",
            render: (publisher) => {
                const handleEditClick = () => {
                    const params = new URLSearchParams(searchParams);
                    params.set("id", publisher.id.toString());
                    setSearchParams(params);
                };

                const handleDialogClose = () => {
                    const params = new URLSearchParams(searchParams);
                    params.delete("id");
                    setSearchParams(params);
                };

                return (
                    <div className={styles.actions_wrapper}>
                        <div onClick={handleEditClick}>
                            <PublisherFormDialog
                                isEdit={true}
                                publisher={publisher}
                                onSubmit={(data) => {
                                    handleEditSubmit(data);
                                    handleDialogClose();
                                }}
                                onDialogClose={handleDialogClose}
                            />
                        </div>

                        <Tooltip content="Xóa nhà xuất bản">
                            <CustomButton
                                onClick={() => handleDeletePublisher(publisher)}
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
            },
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
            <Box className={styles.publisher_title}>Quản lý Nhà xuất bản</Box>
            <Box className={styles.search_wrapper}>
                <SearchInput
                    value={inputValue}
                    onChange={handleInputChange}
                    onSearch={handleSearch}
                    onClear={handleClearSearch}
                    placeholder="Tìm kiếm tên nhà xuất bản..."
                />
                <PublisherFormDialog
                    isEdit={false}
                    onSubmit={(data) => handleCreatePublisher(data)}
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
                        <CustomTable<PublisherType>
                            tableLayout="fixed"
                            columns={columns}
                            data={publishers}
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

            <ConfirmDialog
                isOpen={confirmDialogOpen}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
                title="Xác nhận xóa"
                description={
                    publisherToDelete
                        ? `Bạn có chắc chắn muốn xóa "${publisherToDelete.name}"?`
                        : ""
                }
            />
        </div>
    );
};

export default Publisher;
