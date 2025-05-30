import React, {
    useState,
    useEffect,
    useMemo,
    useCallback,
    useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
    Book,
    addBook,
    updateBook,
    closeDialog,
} from "@/store/slices/bookSlice";
import styled from "./FormButton.module.css";
import clsx from "clsx";
import CustomButton from "../button/CustomButton";
import editIcon from "@/assets/images/images/edit-icon.svg";
import FormDialog from "./formDialog/FormDialog";
import { CustomInputField } from "../form/CustomInputField";
import { CustomMultiSelect } from "../form/CustomMultiSelect";
import { CustomTextarea } from "../form/CustomTextarea";
import { ReactSelect } from "../form/ReactSelect";
import { RootState } from "@/store/store";
import { Box } from "@chakra-ui/react";
import { bookSchema } from "@/utils/validator/bookForm";
import ThumbnailUpload from "../form/ThumbnailUpload";
import MultiImageUpload from "../form/MultiImageUpload";
import CustomWysiwygEditor from "../form/customWysiwygEditor/CustomWysiwygEditor";

export interface BookFormData {
    id?: number;
    title: string;
    short_description?: string;
    long_description?: string;
    thumbnail_url?: string;
    images?: string[];
    page_count?: number;
    published_year: string;
    quantity: number;
    category_ids: number[];
    author_ids: number[];
    publisher_id: number;
    thumbnailFile?: File | null;
    imageFiles?: File[];
}

interface BookFormDialogProps {
    isEdit?: boolean;
    book?: Book;
    onSubmit?: (data: BookFormData) => void;
    id?: string;
}

const BookFormDialog: React.FC<BookFormDialogProps> = ({
    isEdit = false,
    book,
    onSubmit,
    id,
}) => {
    const dispatch = useDispatch();
    const { categories } = useSelector((state: RootState) => state.categories);
    const { authors } = useSelector((state: RootState) => state.authors);
    const { publishers } = useSelector((state: RootState) => state.publishers);
    const { showDialog, currentBook, isEditMode, loading } = useSelector(
        (state: RootState) => state.books
    );
    const [searchParams, setSearchParams] = useSearchParams();
    const [localIsOpen, setLocalIsOpen] = useState(false);
    const firstRenderRef = useRef(true);

    const isReduxControlled = !id;
    const effectiveBook = isReduxControlled ? currentBook : book;
    const effectiveIsEdit = isReduxControlled ? isEditMode : isEdit;

    const currentYear = new Date().getFullYear();
    const yearOptions = useMemo(() => {
        return Array.from({ length: 100 }, (_, i) => {
            const year = currentYear - i;
            return { value: year.toString(), label: year.toString() };
        });
    }, [currentYear]);

    interface ItemWithIdAndName {
        id: number;
        name: string;
    }

    const createOptions = useCallback(
        (items: ItemWithIdAndName[] = []) =>
            items.map((item) => ({
                value: item.id.toString(),
                label: item.name,
            })),
        []
    );

    const categoryOptions = useMemo(
        () => createOptions(categories),
        [categories, createOptions]
    );
    const authorOptions = useMemo(
        () => createOptions(authors),
        [authors, createOptions]
    );
    const publisherOptions = useMemo(
        () => createOptions(publishers),
        [publishers, createOptions]
    );

    const categoriesToSelect = useMemo(() => {
        if (!Array.isArray(effectiveBook?.category) || !categories?.length)
            return [];

        return effectiveBook.category
            .map((categoryName) => {
                const category = categories.find(
                    (c) =>
                        c.name ===
                        (typeof categoryName === "string"
                            ? categoryName
                            : categoryName.name)
                );
                return category ? category.id.toString() : null;
            })
            .filter(Boolean);
    }, [effectiveBook, categories]);

    const authorsToSelect = useMemo(() => {
        if (!Array.isArray(effectiveBook?.author) || !authors?.length)
            return [];

        return effectiveBook.author
            .map((authorName) => {
                const author = authors.find(
                    (a) =>
                        a.name ===
                        (typeof authorName === "string"
                            ? authorName
                            : authorName.name)
                );
                return author ? author.id.toString() : null;
            })
            .filter(Boolean);
    }, [effectiveBook, authors]);

    const publisherToSelect = useMemo(() => {
        if (!effectiveBook?.publisher || !publishers?.length) return "";

        const publisherName =
            typeof effectiveBook.publisher === "string"
                ? effectiveBook.publisher
                : effectiveBook.publisher && effectiveBook.publisher.name;
        const publisher = publishers.find((p) => p.name === publisherName);
        return publisher ? publisher.id.toString() : "";
    }, [effectiveBook, publishers]);

    const defaultValues = useMemo(() => {
        if (!effectiveIsEdit || !effectiveBook) {
            return {
                title: "",
                short_description: "",
                long_description: "",
                page_count: 1,
                published_year: currentYear.toString(),
                quantity: 1,
                category_ids: [],
                author_ids: [],
                publisher_id: "",
                thumbnailFile: null,
                imageFiles: [],
            };
        }

        return {
            title: effectiveBook.title || "",
            short_description:
                effectiveBook.short_description ||
                effectiveBook.description ||
                "",
            long_description: effectiveBook.description || "",
            page_count: effectiveBook.page || 1,
            published_year:
                effectiveBook.published_year?.toString() ||
                currentYear.toString(),
            quantity:
                effectiveBook.quantity || effectiveBook.stock_quantity || 1,
            category_ids: categoriesToSelect,
            author_ids: authorsToSelect,
            publisher_id: publisherToSelect,
            thumbnailFile:
                effectiveBook.imageFile || effectiveBook.image_url || null,
            imageFiles: Array.isArray(effectiveBook.additional_images)
                ? effectiveBook.additional_images.map((img) => img.url)
                : [],
        };
    }, [
        effectiveIsEdit,
        effectiveBook,
        currentYear,
        categoriesToSelect,
        authorsToSelect,
        publisherToSelect,
    ]);

    const openDialog = () => setLocalIsOpen(true);

    const handleClose = () => {
        if (isReduxControlled) {
            const params = new URLSearchParams(searchParams);
            params.delete("id");
            setSearchParams(params);

            dispatch(closeDialog());
        } else {
            setLocalIsOpen(false);
        }
    };

    const handleFormSubmit = (data: Record<string, unknown>) => {
        const convertToNumbers = (ids: unknown): number[] =>
            Array.isArray(ids) ? ids.map((id) => Number(id)) : [];

        const getSingleValue = (field: unknown) =>
            Array.isArray(field) && field.length > 0 ? field[0] : field;

        const bookData: BookFormData = {
            title: data.title as string,
            short_description: data.short_description as string,
            long_description: data.long_description as string,
            page_count: Number(data.page_count) || 1,
            published_year: data.published_year
                ? String(data.published_year)
                : currentYear.toString(),
            quantity: Number(data.quantity) || 1,
            category_ids: convertToNumbers(data.category_ids),
            author_ids: convertToNumbers(data.author_ids),
            publisher_id: Number(data.publisher_id || 0),
            thumbnailFile: data.thumbnailFile as File | string | null,
            imageFiles: Array.isArray(data.imageFiles)
                ? (data.imageFiles as (File | string)[])
                : [],
        };

        if (!effectiveIsEdit && !bookData.thumbnailFile) {
            console.error("Thumbnail image is required for new books");
            return;
        }

        if (effectiveIsEdit && effectiveBook) {
            bookData.id = effectiveBook.id;
            if (!bookData.thumbnailFile && effectiveBook.image_url) {
                bookData.thumbnailFile = effectiveBook.image_url;
            }
            if (
                bookData.imageFiles.length === 0 &&
                Array.isArray(effectiveBook.additional_images)
            ) {
                bookData.imageFiles = effectiveBook.additional_images.map(
                    (img) => img.url
                );
            }
            dispatch(updateBook(bookData as unknown as Book));
        } else {
            dispatch(addBook(bookData as unknown as Omit<Book, "id">));
        }

        if (onSubmit) {
            onSubmit(bookData);
        }

        if (isReduxControlled) {
            dispatch(closeDialog());
        } else {
            setLocalIsOpen(false);
        }
    };

    useEffect(() => {
        if (firstRenderRef.current) {
            firstRenderRef.current = false;
            return;
        }

        if (!showDialog && !firstRenderRef.current) {
            const params = new URLSearchParams(searchParams);
            params.delete("id");
            setSearchParams(params);
        }
    }, [showDialog, searchParams, setSearchParams]);

    const formFields = (
        <Box display={"flex"} flexDirection={"column"} gap={4}>
            <CustomInputField
                name="title"
                label="Tên sách"
                placeholder="Nhập tên sách"
                required
            />
            <CustomTextarea
                name="short_description"
                label="Mô tả ngắn"
                placeholder="Nhập mô tả ngắn"
                required
            />
            <CustomWysiwygEditor
                name="long_description"
                label="Mô tả chi tiết"
                height="200px"
                required
            />

            <Box display={"flex"} gap={4}>
                <Box flex={1}>
                    <ThumbnailUpload
                        name="thumbnailFile"
                        label="Ảnh thumbnail"
                        required
                    />
                </Box>
                <Box
                    flex={2}
                    display={"flex"}
                    flexDirection={"column"}
                    gap={10}
                >
                    <Box display="flex" gap={4}>
                        <Box flex={1}>
                            <CustomInputField
                                name="page_count"
                                label="Số trang"
                                type="number"
                            />
                        </Box>
                        <Box flex={1}>
                            <CustomInputField
                                name="quantity"
                                label="Số lượng"
                                type="number"
                                required
                            />
                        </Box>
                        <Box flex={1}>
                            <ReactSelect
                                name="published_year"
                                label="Năm xuất bản"
                                options={yearOptions}
                                isSearchable={true}
                                isClearable={false}
                            />
                        </Box>
                    </Box>
                    <Box display={"flex"} gap={10} flexWrap={"wrap"}>
                        <ReactSelect
                            name="publisher_id"
                            label="Nhà xuất bản"
                            options={publisherOptions}
                            placeholder="Chọn nhà xuất bản"
                            required
                            isSearchable={true}
                        />

                        <CustomMultiSelect
                            name="category_ids"
                            label="Danh mục"
                            optionsList={categoryOptions}
                            placeholder="Chọn các danh mục"
                            required
                        />
                        <CustomMultiSelect
                            name="author_ids"
                            label="Tác giả"
                            optionsList={authorOptions}
                            placeholder="Chọn các tác giả"
                            required
                        />
                    </Box>
                </Box>
            </Box>
            <MultiImageUpload
                name="imageFiles"
                label="Hình ảnh sách (tối đa 4 ảnh)"
                maxFiles={4}
                required
            />
        </Box>
    );

    const dialogTitle = effectiveIsEdit ? "Chỉnh sửa sách" : "Thêm sách mới";
    const submitButtonText = effectiveIsEdit ? "Lưu" : "Lưu";

    const dialogProps = {
        title: dialogTitle,
        submitButtonText: submitButtonText,
        onClose: handleClose,
        hideDefaultTrigger: true,
        onSubmit: handleFormSubmit,
        formFields: formFields,
        defaultValues: defaultValues,
        schema: bookSchema,
        isLoading: loading,
    };

    if (isReduxControlled) {
        return (
            <FormDialog width="1000px" {...dialogProps} isOpen={showDialog} />
        );
    }

    return (
        <>
            {isEdit ? (
                <CustomButton
                    id={id}
                    onClick={openDialog}
                    className={clsx(
                        styled.action_button,
                        styled.action_button_left
                    )}
                >
                    <img src={editIcon} alt="Edit" />
                </CustomButton>
            ) : (
                <CustomButton
                    id={id}
                    onClick={openDialog}
                    bg={"var(--primary-color)"}
                >
                    Thêm mới
                </CustomButton>
            )}

            {localIsOpen && (
                <FormDialog {...dialogProps} isOpen={localIsOpen} />
            )}
        </>
    );
};

export default BookFormDialog;
