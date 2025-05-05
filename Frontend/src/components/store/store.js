import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./authSlice"
import bookSlice from "./bookSlice"
import categorySlice from "./categorySlice"
import genreSlice from "./genreSlice"

const store = configureStore({
    reducer: {
        auth: authSlice,
        book:bookSlice,
        category:categorySlice,
        genre:genreSlice,

    }
})

export default store