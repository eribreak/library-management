import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Book {
    id: number;
    title: string;
    slug: string;
    image_url?: string;
}

export interface User {
    id: number;
    name?: string;
    full_name?: string;
    email: string;
}

export interface Review {
    id: number;
    book_id: number;
    comment: string;
    status: string | number;
    star: number;
    user?: User;
    book?: Book;
    created_at?: string;
}

export interface PaginationInfo {
    total: number;
    current_page: number;
    total_pages: number;
    per_page: number;
}

export interface FetchReviewsParams {
    page?: number;
    perPage?: number;
    statusParam?: string;
    stars?: string;
    searchTerm?: string;
}

interface UpdateReviewStatusPayload {
    reviewId: number;
    status: string;
}

interface ReviewState {
    reviews: Review[];
    loading: boolean;
    error: string | null;
    filterStatus?: string;
    filterStars?: string;
    searchTerm?: string;
    pagination: PaginationInfo;
}

const initialState: ReviewState = {
    reviews: [],
    loading: false,
    error: null,
    filterStatus: undefined,
    filterStars: undefined,
    searchTerm: "",
    pagination: {
        total: 0,
        current_page: 1,
        total_pages: 1,
        per_page: 10,
    },
};

const reviewSlice = createSlice({
    name: "reviews",
    initialState,
    reducers: {
        fetchReviews(state, action: PayloadAction<FetchReviewsParams>) {
            state.loading = true;
            state.error = null;
            if (action.payload.status !== undefined) {
                state.filterStatus = action.payload.status;
            }
            if (action.payload.stars !== undefined) {
                state.filterStars = action.payload.stars;
            }
            if (action.payload.searchTerm !== undefined) {
                state.searchTerm = action.payload.searchTerm;
            }
        },
        fetchReviewsSuccess(
            state,
            action: PayloadAction<{
                data: Review[];
                pagination: PaginationInfo;
            }>
        ) {
            state.reviews = action.payload.data;
            state.pagination = action.payload.pagination;
            state.loading = false;
        },
        fetchReviewsFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        updateReviewStatus(
            state,
            action: PayloadAction<UpdateReviewStatusPayload>
        ) {
            state.loading = true;
            state.error = null;
        },
        updateReviewStatusSuccess(state, action: PayloadAction<Review>) {
            const updatedReview = action.payload;
            state.reviews = state.reviews.map((review) =>
                review.id === updatedReview.id ? updatedReview : review
            );
            state.loading = false;
        },
        updateReviewStatusFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchReviews,
    fetchReviewsSuccess,
    fetchReviewsFailure,
    updateReviewStatus,
    updateReviewStatusSuccess,
    updateReviewStatusFailure,
} = reviewSlice.actions;

export const reviewsReducer = reviewSlice.reducer;
