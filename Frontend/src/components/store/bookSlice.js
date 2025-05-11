import { createSlice } from "@reduxjs/toolkit";
import { STATUS } from "../globals/status/status";
import { API, APIAuthenticated } from "../http";

const bookSlice = createSlice({
    name: "book",
    initialState: {
        book: [],
        singleBook: null,
        status: STATUS.LOADING,
        searchBook:[],
    },
    reducers: {
        setBookData(state, action) {
            state.book = action.payload;
        },
        setSingleBook(state, action) {
            state.singleBook = action.payload;
        },
        setSearchBook(state, action) {
            state.searchBook = action.payload;
        },
        setStatus(state, action) {
            state.status = action.payload;
        },
        resetStatus(state) {
            state.status = STATUS.LOADING;
          },
        setUpdateBook(state, action) {
            const index = state.book.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.book[index] = {
                    ...state.book[index],
                    ...action.payload.data,
                };
            }
        },
        setDeleteBook(state, action) {
            state.book = state.book.filter(item => item.id !== action.payload.bookId);
        },
    },
});

export const {
    setBookData,
    setSingleBook,
    setStatus,
    setDeleteBook,
    setUpdateBook,
    resetStatus, setSearchBook
} = bookSlice.actions;

export default bookSlice.reducer;

// Add Book
export function addBook(bookData) {
    return async function addBookThunk(dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await APIAuthenticated.post("/api/book/add", bookData);
            if (response.status === 200) {
                dispatch(setStatus(STATUS.SUCCESS));
                dispatch(listAllBook());
            } else {
                dispatch(setStatus(STATUS.ERROR));
            }
        } catch (err) {
            console.error(err);
            dispatch(setStatus(STATUS.ERROR));
        }
    };
}

// List All Books
export function listAllBook() {
    return async function listAllBookThunk(dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await API.get("/api/book/getAllBook");
            if (response.status === 200) {
                dispatch(setBookData(response.data.data));
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

// Get Single Book
export function listSingleBook(bookId) {
    return async function listSingleBookThunk(dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await APIAuthenticated.get(`/api/book/singleBook/${bookId}`);
            if (response.status === 200) {
                dispatch(setSingleBook(response.data.data));
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

// Delete Book
export function deleteBook(bookId) {
    return async function deleteBookThunk(dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await APIAuthenticated.delete(`/api/book/delete/${bookId}`);
            if (response.status === 200) {
                dispatch(setDeleteBook({ bookId }));
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

// Update Book
export function updateBook({ id, bookData }) {
    return async function updateBookThunk(dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await APIAuthenticated.patch(`/api/book/update/${id}`, bookData);
            if (response.status === 200) {
                dispatch(setUpdateBook({ id, data: response.data.data }));
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


// Search books by title, ISBN, description, genre, or category
export function searchBookDetails(query) {
    return async function searchBookDetailsTHunk(dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await APIAuthenticated.get(`/api/book/search?query=${query}`);
            if (response.status === 200) {
                dispatch(setSearchBook(response.data.data)); 
                dispatch(setStatus(STATUS.SUCCESS));
            } else {
                dispatch(setStatus(STATUS.ERROR));
            }
        } catch (err) {
            console.error("Error fetching search results:", err);
            dispatch(setStatus(STATUS.ERROR));
        }
    };
}

//addd the discount for the certain time
export function addTimeDiscount(bookId, discountData) {
  return async function addTimeDiscountThunk(dispatch) {
    dispatch(setStatus(STATUS.LOADING));
    try {
      const response = await APIAuthenticated.patch(`/api/book/update-discount/${bookId}`, discountData);
      if (response.status === 200) {
        dispatch(setStatus(STATUS.SUCCESS));
        dispatch(listAllBook());
      } else {
        dispatch(setStatus(STATUS.ERROR));
      }
    } catch (err) {
      console.error("Error updating discount:", err);
      dispatch(setStatus(STATUS.ERROR));
    }
  };
}
