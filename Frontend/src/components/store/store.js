import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./authSlice"
import bookSlice from "./bookSlice"
import categorySlice from "./categorySlice"
import genreSlice from "./genreSlice"
import cartSlice from "./cartSlice"
import orderSlice from "./orderSlice"
import whiteListSlice from "./whiteListSlice"
import reviewSlice from "./ReviewSlice"
import announcementSlice from "./AnnouncementSlice"
import notificationSlice from "./notificationSlice"
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
        announcement:announcementSlice,
        notifications:notificationSlice,
    }
})

export default store