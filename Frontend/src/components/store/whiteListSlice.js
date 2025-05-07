import { createSlice } from "@reduxjs/toolkit";
import { STATUS } from "../globals/status/status";
import { API, APIAuthenticated } from "../http";

const whiteListSlice = createSlice({
    name: "whiteList",
    initialState: {
        whiteList: [],      // To store the full list of books in the whitelist
        status: STATUS.LOADING,
    },

    reducers: {
        setWhiteListData(state, action) {
            state.whiteList = action.payload;  // Update whiteList with the fetched data
        },
        setStatus(state, action) {
            state.status = action.payload;  // Update status (LOADING, SUCCESS, ERROR)
        },
        setRemoveFromWhiteList(state, action) {
            // Remove the book from the list after successful deletion
            state.whiteList = state.whiteList.filter(item => item.WhiteListId !== action.payload.WhiteListId);  
        },
        resetStatus(state) {
            state.status = STATUS.LOADING;
        }
    },
});

export const {
    setWhiteListData,
    setStatus,
    setRemoveFromWhiteList,
    resetStatus
} = whiteListSlice.actions;

export default whiteListSlice.reducer;

export function addToWhiteList(bookId) {
    return async function addToWhiteListThunk(dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await APIAuthenticated.post("/api/whiteList", { bookId }); // BookId in request body
            if (response.status === 200) {
                dispatch(setStatus(STATUS.SUCCESS));
                dispatch(listAllWhiteList());  // Re-fetch the updated whitelist
            } else {
                dispatch(setStatus(STATUS.ERROR));
            }
        } catch (err) {
            console.error(err);
            dispatch(setStatus(STATUS.ERROR));
        }
    };
}

export function listAllWhiteList() {
    return async function listAllWhiteListThunk(dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await APIAuthenticated.get("/api/whiteList");  // Get user's whitelist
            if (response.status === 200) {
                dispatch(setWhiteListData(response.data));  // Update Redux state with fetched data
                dispatch(setStatus(STATUS.SUCCESS));
            } else {
                dispatch(setStatus(STATUS.ERROR));
            }
        } catch (err) {
            console.error(err);
            dispatch(setStatus(STATUS.ERROR));
        }
    };
}


export function removeBookFromWhiteList(bookId) {
    return async function removeBookFromWhiteListThunk(dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await APIAuthenticated.delete("/api/whiteList/delete", {
                data: { bookId }  // Pass BookId in the body for deletion
            });
            if (response.status === 200) {
                dispatch(setRemoveFromWhiteList({ WhiteListId: bookId }));  // Remove book from Redux state
                dispatch(setStatus(STATUS.SUCCESS));
            } else {
                dispatch(setStatus(STATUS.ERROR));
            }
        } catch (err) {
            console.error(err);
            dispatch(setStatus(STATUS.ERROR));
        }
    };
}
