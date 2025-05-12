import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Publisher.module.css";
import SearchInput from "../../components/common/search-input/SearchInput";
import { CustomTable } from "@/components/common/table";
import { Column } from "@/components/common/table/CustomTable";
import SimplePagination from "../../components/common/pagination/SimplePagination";
import { Toaster } from "@/components/ui/toaster";
import deleteIcon from "@/assets/images/images/delete-icon.svg";
import clsx from "clsx";
import {
    fetchPublishers,
    createPublisher,
    updatePublisher,
    deletePublisher,
    Publisher as PublisherType,
    PublisherFormData,
} from "@/store/slices/publisherSlice";
import { RootState } from "@/store/store";
import PublisherFormDialog from "@/components/common/dialog/PublisherFormDialog";
import CustomButton from "@/components/common/button/CustomButton";
import { Box, Flex } from "@chakra-ui/react";
import { MdDeleteSweep } from "react-icons/md";


const Publisher: React.FC = () => {
    const dispatch = useDispatch();
    const { publishers, loading, pagination } = useSelector(
        (state: RootState) => state.publishers
    );

    const [selectedPublishers, setSelectedPublishers] = useState<number[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);

    useEffect(() => {
        dispatch(
            fetchPublishers({
                page: currentPage,
                perPage: itemsPerPage,
                searchTerm,
            })
        );
        setSelectedPublishers([]);
    }, [dispatch, searchTerm, currentPage, itemsPerPage]);

    const headerCheckbox = (
        <input
            type="checkbox"
            checked={
                publishers.length > 0 &&
                selectedPublishers.length === publishers.length
            }
            onChange={(e) => {
                if (e.target.checked) {
                    const allIds = publishers.map((pub) => pub.id);
                    setSelectedPublishers(allIds);
                } else {
                    setSelectedPublishers([]);
                }
            }}
            className={styles.publisher_checkbox}
        />
    );

    const handleInputChange = (term: string) => {
        setInputValue(term);
    };

    const handleCreatePublisher = (data: PublisherFormData) => {
        dispatch(createPublisher(data));
    };

    const handleEditSubmit = (data: PublisherFormData) => {
        dispatch(updatePublisher(data));
    };

    const handleDeletePublisher = (publisher: PublisherType) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa "${publisher.name}"?`)) {
            dispatch(deletePublisher(publisher.id));
        }
    };

    const handleSearch = () => {
        setSearchTerm(inputValue);
        setCurrentPage(1);
    };

    const handleBulkDelete = () => {
        if (
            window.confirm(
                "Bạn có chắc chắn muốn xóa những nhà xuất bản đã chọn?"
            )
        ) {
            selectedPublishers.forEach((id) => {
                dispatch(deletePublisher(id));
            });
            setSelectedPublishers([]);
        }
    };

    const handleUnselectAll = () => {
        setSelectedPublishers([]);
    };

    const columns: Column<PublisherType>[] = [
        {
            key: "select",
            header: headerCheckbox,
            width: "50px",
            render: (publisher) => (
                <input
                    type="checkbox"
                    checked={selectedPublishers.includes(publisher.id)}
                    onChange={(e) => {
                        if (e.target.checked) {
                            setSelectedPublishers([
                                ...selectedPublishers,
                                publisher.id,
                            ]);
                        } else {
                            setSelectedPublishers(
                                selectedPublishers.filter(
                                    (id) => id !== publisher.id
                                )
                            );
                        }
                    }}
                    className={styles.publisher_checkbox}
                />
            ),
        },
        {
            key: "id",
            width: "5%",
            header: "ID",
            render: (publisher) => <div>{publisher.id}</div>,
        },
        {
            key: "name",
            width: "25%",
            header: "Tên nhà xuất bản",

            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: (publisher) => (
                <div className={styles.publisher_name}>{publisher.name}</div>
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
                <div className={styles.publisher_description}>
                    {publisher.description}
                </div>
            ),
        },
        {
            key: "actions",
            header: "Thao tác",
            headerTextAlign: "center",
            render: (publisher) => (
                <div className={styles.actions_wrapper}>
                    <PublisherFormDialog
                        isEdit={true}
                        publisher={publisher}
                        onSubmit={(data) => handleEditSubmit(data)}
                    />

                    <CustomButton
                        onClick={() => handleDeletePublisher(publisher)}
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
            <Box className={styles.publisher_title}>Quản lý Nhà xuất bản</Box>
            <Box className={styles.search_wrapper}>
                <SearchInput
                    value={inputValue}
                    onChange={handleInputChange}
                    onSearch={handleSearch}
                    placeholder="Tìm kiếm tên nhà xuất bản..."
                />
                <PublisherFormDialog
                    isEdit={false}
                    onSubmit={(data) => handleCreatePublisher(data)}
                />
            </Box>

            <Flex gap={2}>
                <CustomButton
                title="Xóa nhiều"
                    onClick={handleBulkDelete}
                    disabled={selectedPublishers.length === 0}
                    className={styles.bulk_delete_button}
                >
                    <MdDeleteSweep />
                </CustomButton>

                {selectedPublishers.length > 0 && (
                    <CustomButton
                        onClick={handleUnselectAll}
                        bg="gray.500"
                        _hover={{ bg: "gray.600" }}
                    >
                        Bỏ chọn tất cả ({selectedPublishers.length})
                    </CustomButton>
                )}
            </Flex>

            {loading ? (
                <div className={styles.loading}>Loading...</div>
            ) : (
                <>
                    <CustomTable<PublisherType>
                        columns={columns}
                        data={publishers}
                    />
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

export default Publisher;
