import { combineReducers } from "@reduxjs/toolkit";
import { categoriesReducer } from "./slices/categorySlice";
import { authReducer } from "./slices/authSlice";

const rootReducer = combineReducers({
    categories: categoriesReducer,
    auth: authReducer,
});

export default rootReducer;
