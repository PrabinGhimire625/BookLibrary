import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./authSlice"
import bookSlice from "./bookSlice"
import categorySlice from "./categorySlice"
import genreSlice from "./genreSlice"
import cartSlice from "./cartSlice"
import orderSlice from "./orderSlice"
import whiteListSlice from "./whiteListSlice"
import reviewSlice from "./ReviewSlice"

const store = configureStore({
    reducer: {
        auth: authSlice,
        book:bookSlice,
        category:categorySlice,
        genre:genreSlice,
        cart:cartSlice,
        order:orderSlice,
        whiteList:whiteListSlice,
        review:reviewSlice,

    }
})

export default store