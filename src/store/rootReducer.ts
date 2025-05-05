import { combineReducers } from "@reduxjs/toolkit";
import { categoriesReducer } from "./slices/categorySlice";
import { authReducer } from "./slices/authSlice";
import { publishersReducer } from "./slices/publisherSlice";
import { authorsReducer } from "./slices/authorSlice";
import { employeesReducer } from "./slices/employeeSlice";
import { ordersReducer } from "./slices/orderSlice";
import { usersReducer } from "./slices/userSlice";
import { reviewsReducer } from "./slices/reviewSlice";
import { booksReducer } from "./slices/bookSlice";

const rootReducer = combineReducers({
    categories: categoriesReducer,
    auth: authReducer,
    publishers: publishersReducer,
    authors: authorsReducer,
    employees: employeesReducer,
    orders: ordersReducer,
    users: usersReducer,
    reviews: reviewsReducer,
    books: booksReducer,
});

export default rootReducer;
