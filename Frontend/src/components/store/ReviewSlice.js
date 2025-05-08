import { createSlice } from "@reduxjs/toolkit";
import { STATUS } from "../globals/status/status";
import { API, APIAuthenticated } from "../http";

const reviewSlice = createSlice({
    name: "review",
    initialState: {
        review: [],
        singleBookReview: null,
        status: STATUS.LOADING,
    },
    
    reducers: {
        setReviewData(state, action) {
            state.review = action.payload;
        },
        setSingleBookReview(state, action) {
            state.singleBookReview = action.payload;
        },
        setStatus(state, action) {
            state.status = action.payload;
        },
        resetStatus(state) {
            state.status = STATUS.LOADING;
          }  
    },
});



export const {
    setReviewData,
    setSingleBookReview,
    setStatus,
    resetStatus
} = reviewSlice.actions;

export default reviewSlice.reducer;

// Add review
export function addReview(reviewData) {
    return async function addReviewThunk(dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await APIAuthenticated.post("/api/review/add", reviewData);
            if (response.status === 200) {
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


// Get Single review
export function listSingleBookReview(bookId) {
    return async function listSingleBookReviewThunk(dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await APIAuthenticated.get(`/api/review/singleBook/${bookId}`);
            if (response.status === 200) {
                dispatch(setSingleBookReview(response.data));
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
