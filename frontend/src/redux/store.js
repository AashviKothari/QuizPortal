import usersSlice from "./usersSlice";
import loaderSlice from "./loaderSlice";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
    reducer: {
        users: usersSlice,
        loaders: loaderSlice
    }
})

export default store