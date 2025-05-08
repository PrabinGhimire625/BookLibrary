import { createSlice } from "@reduxjs/toolkit";
import { STATUS } from "../globals/status/status";
import { API, APIAuthenticated } from "../http";

const bookSlice = createSlice({
    name: "book",
    initialState: {
        allBooks: [],
        latestBooks: [],
        latestHistoricalBooks: [],
        latestRomanceBooks: [],
        topRatedBooks: [],
        status: STATUS.LOADING,
        singleBookReview: null,
    },
    reducers: {
        setAllBooks(state, action) {
            state.allBooks = action.payload;
        },
        setLatestBooks(state, action) {
            state.latestBooks = action.payload;
        },
        setLatestHistoricalBooks(state, action) {
            state.latestHistoricalBooks = action.payload;
        },
        setLatestRomanceBooks(state, action) {
            state.latestRomanceBooks = action.payload;
        },
        setTopRatedBooks(state, action) {
            state.topRatedBooks = action.payload;
        },
        setStatus(state, action) {
            state.status = action.payload;
        },
        resetStatus(state) {
            state.status = STATUS.LOADING;
        },
        setSingleBookReview(state, action) {
            state.singleBookReview = action.payload;
        }
    },
});

export const {
    setAllBooks,
    setLatestBooks,
    setLatestHistoricalBooks,
    setLatestRomanceBooks,
    setTopRatedBooks,
    setStatus,
    resetStatus,setSingleBookReview
} = bookSlice.actions;

export default bookSlice.reducer;


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

// Get all books with ratings & reviews
export function getAllBooks() {
    return async function getAllBooksThunk(dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await API.get("/api/review/getAllBook");
            if (response.status === 200) {
                dispatch(setAllBooks(response.data.data));
                dispatch(setStatus(STATUS.SUCCESS));
            } else {
                dispatch(setStatus(STATUS.ERROR));
            }
        } catch (error) {
            console.error(error);
            dispatch(setStatus(STATUS.ERROR));
        }
    };
}

// Get latest 5 books
export function getLatestBooks() {
    return async function getLatestBooksThunk(dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await API.get("/api/review/latest5Books");
            if (response.status === 200) {
                dispatch(setLatestBooks(response.data.data));
                dispatch(setStatus(STATUS.SUCCESS));
            } else {
                dispatch(setStatus(STATUS.ERROR));
            }
        } catch (error) {
            console.error(error);
            dispatch(setStatus(STATUS.ERROR));
        }
    };
}

// Get latest 5 historical books
export function getLatestHistoricalBooks() {
    return async function getLatestHistoricalBooksThunk(dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await API.get("/api/review/latest5historicalBooks");
            if (response.status === 200) {
                dispatch(setLatestHistoricalBooks(response.data.data));
                dispatch(setStatus(STATUS.SUCCESS));
            } else {
                dispatch(setStatus(STATUS.ERROR));
            }
        } catch (error) {
            console.error(error);
            dispatch(setStatus(STATUS.ERROR));
        }
    };
}

// Get latest 5 romance books
export function getLatestRomanceBooks() {
    return async function getLatestRomanceBooksThunk(dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await API.get("/api/review/latest5RomanceBooks");
            if (response.status === 200) {
                dispatch(setLatestRomanceBooks(response.data.data));
                dispatch(setStatus(STATUS.SUCCESS));
            } else {
                dispatch(setStatus(STATUS.ERROR));
            }
        } catch (error) {
            console.error(error);
            dispatch(setStatus(STATUS.ERROR));
        }
    };
}

// Get top 5 highest-rated books
export function getTopRatedBooks() {
    return async function getTopRatedBooksThunk(dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await API.get("/api/review/top5HighestRatedBooks");
            if (response.status === 200) {
                dispatch(setTopRatedBooks(response.data.data));
                dispatch(setStatus(STATUS.SUCCESS));
            } else {
                dispatch(setStatus(STATUS.ERROR));
            }
        } catch (error) {
            console.error(error);
            dispatch(setStatus(STATUS.ERROR));
        }
    };
}
