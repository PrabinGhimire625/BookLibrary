import { createSlice } from "@reduxjs/toolkit";
import { STATUS } from "../globals/status/status";
import { API, APIAuthenticated } from "../http";

const genreSlice = createSlice({
    name: "genre",
    initialState: {
        genre: [],
        singleGenre: null,
        status: STATUS.LOADING,
    },
    
    reducers: {
        setGenreData(state, action) {
            state.genre = action.payload;
        },
        setSingleGenre(state, action) {
            state.singleGenre = action.payload;
        },
        setStatus(state, action) {
            state.status = action.payload;
        },
        resetStatus(state) {
            state.status = STATUS.LOADING;
          },
        setUpdategenre(state, action) {
            const index = state.genre.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.genre[index] = {
                    ...state.genre[index],
                    ...action.payload.data,
                };
            }
        },
        setDeleteGenre(state, action) {
            state.genre = state.genre.filter(item => item.genreId !== action.payload.genreId);  
        }
        
    },
});

export const {
    setGenreData,
    setSingleGenre,
    setStatus,
    setDeleteGenre,
    setUpdategenre,
    resetStatus
} = genreSlice.actions;

export default genreSlice.reducer;

// Add genre
export function addGenre(genreData) {
    return async function addGenreThunk(dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await APIAuthenticated.post("/api/genres/create", genreData);
            if (response.status === 200) {
                dispatch(setStatus(STATUS.SUCCESS));
                dispatch(listAllGenre());
            } else {
                dispatch(setStatus(STATUS.ERROR));
            }
        } catch (err) {
            console.error(err);
            dispatch(setStatus(STATUS.ERROR));
        }
    };
}

// List All genre
export function listAllGenre() {
    return async function listAllGenreThunk(dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await API.get("/api/genres/getAll");
            console.log("response", response)
            if (response.status === 200) {
                dispatch(setGenreData(response.data));
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

// Get Single genre
export function listSingleGenre(genreId) {
    return async function listSingleGenreThunk(dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await APIAuthenticated.get(`/api/genres/details/${genreId}`);
            if (response.status === 200) {
                dispatch(setSingleGenre(response.data.data));
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

// Delete genre
export function deleteGenre(genreId) {
    return async function deleteGenreThunk(dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await APIAuthenticated.delete(`/api/genres/delete/${genreId}`);
            if (response.status === 200) {
                dispatch(setDeleteGenre({ genreId }));
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

// Update genre
export function updateGenre({ id, genreData }) {
    return async function updateGenreThunk(dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await APIAuthenticated.patch(`/api/genres/update/${id}`, genreData
            );
            if (response.status === 200) {
                dispatch(setUpdategenre({ id, data: response.data.data }));
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
