import {configureStore} from "@reduxjs/toolkit"
import authSlice from "./authSlice"
import bookSlice from "./bookSlice"



const store=configureStore({
    reducer : {
        auth : authSlice,
        book : bookSlice
    }
})

export default store