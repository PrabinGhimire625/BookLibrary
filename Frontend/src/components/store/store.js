import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./authSlice"
import bookSlice from "./bookSlice"
import categorySlice from "./categorySlice"

const store = configureStore({
    reducer: {
        auth: authSlice,
        book:bookSlice,
        category:categorySlice,

    }
})

export default store