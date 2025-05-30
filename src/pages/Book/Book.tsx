import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import CustomTable, { Column } from "@/components/common/table/CustomTable";
import { RootState } from "@/store/store";
import styles from "./Book.module.css";
import SimplePagination from "@/components/common/pagination/SimplePagination";
import { Toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";
import { Box, Button, Stack, Center, Spinner } from "@chakra-ui/react";
import {
    Book as BookType,
    fetchBooks,
    openAddDialog,
    openEditDialog,
    deleteBook,
} from "@/store/slices/bookSlice";
import {
    fetchCategories,
    resetCategoryState,
} from "@/store/slices/categorySlice";
import { fetchAuthors, resetAuthorState } from "@/store/slices/authorSlice";
import {
    fetchPublishers,
    resetPublisherState,
} from "@/store/slices/publisherSlice";
import BookFormDialog from "@/components/common/dialog/BookFormDialog";
import CustomButton from "@/components/common/button/CustomButton";
import editIcon from "@/assets/images/images/edit-icon.svg";
import deleteIcon from "@/assets/images/images/delete-icon.svg";
import clsx from "clsx";
import { IoMdAddCircleOutline } from "react-icons/io";
import ConfirmDialog from "@/components/common/dialog/ConfirmDialog";
import { RiResetLeftLine } from "react-icons/ri";
import { IoSearchSharp } from "react-icons/io5";

const Book = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const { books, loading, showDialog, pagination, currentBook } = useSelector(
        (state: RootState) => state.books
    );
    const { authors } = useSelector((state: RootState) => state.authors);
    const { publishers } = useSelector((state: RootState) => state.publishers);
    const { categories } = useSelector((state: RootState) => state.categories);

    const pageFromUrl = searchParams.get("page");
    const searchTermFromUrl = searchParams.get("search");
    const idFromUrl = searchParams.get("id");
    const authorIdFromUrl = searchParams.get("authorId");
    const publisherIdFromUrl = searchParams.get("publisherId");
    const categoryIdFromUrl = searchParams.get("categoryId");
    const includeDeletedFromUrl = searchParams.get("includeDeleted") === "true";

    const [searchInput, setSearchInput] = useState(searchTermFromUrl || "");
    const [searchTerm, setSearchTerm] = useState(searchTermFromUrl || "");
    const [currentPage, setCurrentPage] = useState(
        pageFromUrl ? parseInt(pageFromUrl) : 1
    );
    const [itemsPerPage] = useState(4);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [bookToDelete, setBookToDelete] = useState<BookType | null>(null);

    const dialogOpenRef = useRef(showDialog);

    const [filterAuthorId, setFilterAuthorId] = useState(authorIdFromUrl || "");
    const [filterPublisherId, setFilterPublisherId] = useState(
        publisherIdFromUrl || ""
    );
    const [filterCategoryId, setFilterCategoryId] = useState(
        categoryIdFromUrl || ""
    );
    const [includeDeleted, setIncludeDeleted] = useState(includeDeletedFromUrl);
    const [isFilterApplied, setIsFilterApplied] = useState(
        !!(
            authorIdFromUrl ||
            publisherIdFromUrl ||
            categoryIdFromUrl ||
            includeDeletedFromUrl
        )
    );

    const [activeFilters, setActiveFilters] = useState<{
        authorId?: string;
        publisherId?: string;
        categoryId?: string;
        includeDeleted?: boolean;
    }>({
        authorId: authorIdFromUrl || undefined,
        publisherId: publisherIdFromUrl || undefined,
        categoryId: categoryIdFromUrl || undefined,
        includeDeleted: includeDeletedFromUrl || undefined,
    });

    useEffect(() => {
        dispatch(
            fetchBooks({
                searchTerm,
                page: currentPage,
                perPage: itemsPerPage,
                ...activeFilters,
            })
        );
    }, [dispatch, searchTerm, currentPage, itemsPerPage, activeFilters]);

    useEffect(() => {
        if (showDialog && !dialogOpenRef.current && currentBook?.id) {
            console.log("Opening dialog with book ID:", currentBook.id);
            const params = new URLSearchParams(searchParams);
            params.set("id", currentBook.id.toString());
            setSearchParams(params);
        }

        if (!showDialog && dialogOpenRef.current) {
            console.log("Closing dialog, removing ID from URL");
            const params = new URLSearchParams(searchParams);
            params.delete("id");
            setSearchParams(params);
        }

        dialogOpenRef.current = showDialog;
    }, [showDialog, currentBook, searchParams, setSearchParams]);

    useEffect(() => {
        dispatch(
            fetchCategories({
                page: 1,
                perPage: 99,
                searchTerm: "",
            })
        );

        dispatch(
            fetchAuthors({
                page: 1,
                perPage: 99,
                searchTerm: "",
            })
        );

        dispatch(
            fetchPublishers({
                page: 1,
                perPage: 99,
                searchTerm: "",
            })
        );
    }, [dispatch]);

    useEffect(() => {
        if (
            authorIdFromUrl ||
            publisherIdFromUrl ||
            categoryIdFromUrl ||
            includeDeletedFromUrl
        ) {
            console.log("Initializing filters from URL parameters");

            setIsFilterApplied(
                !!(
                    authorIdFromUrl ||
                    publisherIdFromUrl ||
                    categoryIdFromUrl ||
                    includeDeletedFromUrl
                )
            );
        }
    }, []);

    useEffect(() => {
        return () => {
            dispatch(resetCategoryState());
            dispatch(resetAuthorState());
            dispatch(resetPublisherState());
        };
    }, [dispatch]);

    const handleInputChange = (term: string) => {
        setSearchInput(term);
    };

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

    const handleApplyFilter = () => {
        const newFilters = {
            authorId: filterAuthorId || undefined,
            publisherId: filterPublisherId || undefined,
            categoryId: filterCategoryId || undefined,
            includeDeleted: includeDeleted || undefined,
        };

        setActiveFilters(newFilters);
        setIsFilterApplied(true);
        setCurrentPage(1);
        setSearchTerm(searchInput);

        const params = new URLSearchParams(searchParams);

        if (filterAuthorId) {
            params.set("authorId", filterAuthorId);
        } else {
            params.delete("authorId");
        }

        if (filterPublisherId) {
            params.set("publisherId", filterPublisherId);
        } else {
            params.delete("publisherId");
        }

        if (filterCategoryId) {
            params.set("categoryId", filterCategoryId);
        } else {
            params.delete("categoryId");
        }

        if (includeDeleted) {
            params.set("includeDeleted", "true");
        } else {
            params.delete("includeDeleted");
        }

        if (searchInput) {
            params.set("search", searchInput);
        } else {
            params.delete("search");
        }

        if (idFromUrl && showDialog) {
            params.set("id", idFromUrl);
        }

        setSearchParams(params);
    };

    const handleResetFilter = () => {
        setFilterAuthorId("");
        setFilterPublisherId("");
        setFilterCategoryId("");
        setIncludeDeleted(false);
        setActiveFilters({});
        setIsFilterApplied(false);
        setSearchInput("");
        setSearchTerm("");

        const params = new URLSearchParams();
        if (currentPage > 1) {
            params.set("page", currentPage.toString());
        }
        if (idFromUrl && showDialog) {
            params.set("id", idFromUrl);
        }
        setSearchParams(params);
    };

    const handleAddNew = () => {
        dispatch(openAddDialog());
    };

    const handleEditBook = (book: BookType) => {
        console.log("Editing book:", {
            book,
            category: book.category,
            author: book.author,
            publisher: book.publisher,
            page: book.page,
            published_year: book.published_year,
            quantity: book.quantity,
        });

        const processedBook = {
            ...book,

            category_ids:
                book.category && Array.isArray(book.category)
                    ? book.category.map((c) =>
                          typeof c === "object" && c !== null && "id" in c
                              ? c.id.toString()
                              : String(c)
                      )
                    : [],

            author_ids:
                book.author && Array.isArray(book.author)
                    ? book.author.map((a) =>
                          typeof a === "object" && a !== null && "id" in a
                              ? a.id.toString()
                              : String(a)
                      )
                    : [],

            publisher_id:
                typeof book.publisher === "object" && book.publisher
                    ? book.publisher.id.toString()
                    : typeof book.publisher === "string"
                    ? book.publisher
                    : "",

            page_count: book.page,
        };
        console.log("Mở dialog chỉnh sửa với:", processedBook);

        const params = new URLSearchParams(searchParams);
        params.set("id", book.id.toString());
        setSearchParams(params);

        dispatch(openEditDialog(processedBook));
    };

    const handleDeleteBookAction = (book: BookType) => {
        if (book.deleted_at) {
            return;
        }

        setBookToDelete(book);
        setConfirmDialogOpen(true);

        const params = new URLSearchParams(searchParams);
        params.set("id", book.id.toString());
        setSearchParams(params);
    };

    const handleConfirmDelete = () => {
        if (bookToDelete) {
            dispatch(deleteBook(bookToDelete.id));
        }
        setConfirmDialogOpen(false);

        const params = new URLSearchParams(searchParams);
        params.delete("id");
        setSearchParams(params);
    };

    const handleCancelDelete = () => {
        setConfirmDialogOpen(false);

        const params = new URLSearchParams(searchParams);
        params.delete("id");
        setSearchParams(params);
    };

    const getRowClassName = (book: BookType) => {
        return book.deleted_at ? styles.deleted_row : "";
    };

    const columns: Column<BookType>[] = [
        {
            key: "id" as keyof BookType,
            header: "ID",
            width: "7%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: (book) => (
                <Tooltip content={`ID: ${book.id}`}>
                    <div className={styles.book_id}>{book.id}</div>
                </Tooltip>
            ),
        },
        {
            key: "image_url" as keyof BookType,
            header: "Ảnh thumbnail",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: "13%",
            render: (book) => (
                <Tooltip content={book.title}>
                    <img
                        src={
                            book.image_url ||
                            book.thumbnail_url ||
                            "/placeholder-book.jpg"
                        }
                        alt={book.title}
                        className={styles.book_thumbnail}
                    />
                </Tooltip>
            ),
        },
        {
            key: "title" as keyof BookType,
            header: "Tên sách",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: (book) => (
                <Tooltip content={book.title}>
                    <div className={styles.book_title}>{book.title}</div>
                </Tooltip>
            ),
        },
        {
            key: "order_details_count" as keyof BookType,
            width: "8%",
            header: "Số lượng",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",

            render: (book) => (
                <Tooltip
                    content={`Số lượng: ${
                        book.stock_quantity || book.order_details_count || 0
                    }`}
                >
                    <div>
                        {book.stock_quantity || book.order_details_count || 0}
                    </div>
                </Tooltip>
            ),
        },
        {
            key: "category" as keyof BookType,
            header: "Danh mục",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: (book) => (
                <Tooltip
                    content={book.category?.join(", ") || "Chưa phân loại"}
                >
                    <div className={styles.book_text_detail}>
                        {book.category?.join(", ") || "Chưa phân loại"}
                    </div>
                </Tooltip>
            ),
        },
        {
            key: "author" as keyof BookType,
            header: "Tên các tác giả",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: (book) => (
                <Tooltip content={book.author?.join(", ") || "Không có"}>
                    <div className={styles.book_text_detail}>
                        {book.author?.join(", ") || "Không có"}
                    </div>
                </Tooltip>
            ),
        },
        {
            key: "publisher" as keyof BookType,
            header: "Nhà xuất bản",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: (book) => (
                <Tooltip
                    content={
                        typeof book.publisher === "string"
                            ? book.publisher
                            : book.publisher?.name || "Không có"
                    }
                >
                    <div className={styles.book_text_detail}>
                        {typeof book.publisher === "string"
                            ? book.publisher
                            : book.publisher?.name || "Không có"}
                    </div>
                </Tooltip>
            ),
        },
        {
            key: "action" as keyof BookType,
            header: "Thao tác",
            width: "15%",
            headerTextAlign: "center",
            render: (book) => (
                <div className={styles.action_buttons}>
                    <Tooltip content="Chỉnh sửa sách">
                        <CustomButton
                            onClick={() => handleEditBook(book)}
                            className={clsx(
                                styles.action_button,
                                styles.action_button_left
                            )}
                        >
                            <img src={editIcon} alt="Edit" />
                        </CustomButton>
                    </Tooltip>

                    <Tooltip
                        content={
                            book.deleted_at ? "Sách đã bị xóa" : "Xóa sách"
                        }
                    >
                        <CustomButton
                            onClick={() => handleDeleteBookAction(book)}
                            className={clsx(
                                styles.action_button,
                                styles.action_button_right,
                                book.deleted_at
                                    ? styles.action_button_disabled
                                    : ""
                            )}
                            disabled={!!book.deleted_at}
                        >
                            <img src={deleteIcon} alt="Delete" />
                        </CustomButton>
                    </Tooltip>
                </div>
            ),
        },
    ];

    const totalItems = pagination?.total || 0;
    const totalPages =
        pagination?.total_pages || Math.ceil(totalItems / itemsPerPage);
    const startIndex =
        ((pagination?.current_page || currentPage) - 1) *
            (pagination?.per_page || itemsPerPage) +
        1;
    const endIndex = Math.min(
        startIndex + (pagination?.per_page || itemsPerPage) - 1,
        totalItems
    );

    return (
        <div>
            <Toaster />
            <h1 className={styles.page_title}>Quản lý Sách</h1>

            <Box
                display={"flex"}
                justifyContent={"space-between"}
                flexDirection={"row"}
                alignItems={"center"}
                mb={"1.25rem"}
                gap={3}
            >
                <div className={styles.filter_section}>
                    <Stack
                        direction="row"
                        gap={5}
                        flexWrap="wrap"
                        alignItems="center"
                        justifyContent={"center"}
                    >
                        <div className={styles.filter_group}>
                            <input
                                className={styles.filter_select}
                                type="text"
                                value={searchInput}
                                onChange={(e) =>
                                    handleInputChange(e.target.value)
                                }
                                placeholder="Tìm kiếm tên sách..."
                            />
                        </div>
                        <div className={styles.filter_group}>
                            <select
                                className={styles.filter_select}
                                value={filterAuthorId}
                                onChange={(e) =>
                                    setFilterAuthorId(e.target.value)
                                }
                            >
                                <option value="">Chọn tác giả</option>
                                {authors?.map((author) => (
                                    <option
                                        key={author.id}
                                        value={author.id.toString()}
                                    >
                                        {author.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.filter_group}>
                            <select
                                className={styles.filter_select}
                                value={filterPublisherId}
                                onChange={(e) =>
                                    setFilterPublisherId(e.target.value)
                                }
                            >
                                <option value="">Chọn nhà xuất bản</option>
                                {publishers?.map((publisher) => (
                                    <option
                                        key={publisher.id}
                                        value={publisher.id.toString()}
                                    >
                                        {publisher.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.filter_group}>
                            <select
                                className={styles.filter_select}
                                value={filterCategoryId}
                                onChange={(e) =>
                                    setFilterCategoryId(e.target.value)
                                }
                            >
                                <option value="">Chọn danh mục</option>
                                {categories?.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id.toString()}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.filter_checkbox_group}>
                            <input
                                type="checkbox"
                                className={styles.filter_checkbox}
                                id="includeDeleted"
                                checked={includeDeleted}
                                onChange={(e) =>
                                    setIncludeDeleted(e.target.checked)
                                }
                            />
                            <label
                                htmlFor="includeDeleted"
                                className={styles.filter_checkbox_label}
                            >
                                Sách đã xóa
                            </label>
                        </div>

                        <div className={styles.filter_buttons}>
                            <Button
                                variant="outline"
                                onClick={handleResetFilter}
                                colorScheme={isFilterApplied ? "red" : "gray"}
                                className={
                                    styles.filter_button +
                                    " " +
                                    styles.filter_button_reset
                                }
                            >
                                <Tooltip content="Đặt lại bộ lọc">
                                    <Box
                                        display={"flex"}
                                        alignItems={"center"}
                                        gap={2}
                                    >
                                        <RiResetLeftLine />
                                        <div>Đặt lại</div>
                                    </Box>
                                </Tooltip>
                            </Button>
                            <Button
                                bg={"green.500"}
                                border={"none"}
                                onClick={handleApplyFilter}
                                className={
                                    styles.filter_button +
                                    " " +
                                    styles.filter_button_apply
                                }
                            >
                                <Tooltip content="Áp dụng bộ lọc">
                                    <Box
                                        display={"flex"}
                                        alignItems={"center"}
                                        gap={2}
                                    >
                                        <IoSearchSharp />
                                        <div>Lọc</div>
                                    </Box>
                                </Tooltip>
                            </Button>
                        </div>
                    </Stack>
                </div>
                <CustomButton
                    onClick={handleAddNew}
                    className={styles.add_button}
                    w={"fit-content"}
                >
                    <IoMdAddCircleOutline /> Thêm sách
                </CustomButton>
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
                        <CustomTable
                            tableLayout="fixed"
                            data={books}
                            columns={columns}
                            getRowClassName={getRowClassName}
                        />
                    </Box>

                    {books.length > 0 && (
                        <div>
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
                    )}
                </>
            )}

            {showDialog && <BookFormDialog />}

            <ConfirmDialog
                isOpen={confirmDialogOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Xác nhận xóa sách"
                description={
                    bookToDelete
                        ? `Bạn có chắc chắn muốn xóa sách "${bookToDelete.title}" không?`
                        : "Bạn có chắc chắn muốn xóa sách này không?"
                }
            />
        </div>
    );
};

export default Book;
