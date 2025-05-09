import { createSlice } from "@reduxjs/toolkit";
import { STATUS } from "../globals/status/status";
import { API, APIAuthenticated } from "../http";

const announcementSlice = createSlice({
    name: "announcement",
    initialState: {
        announcement: [],
        activeAnnouncement:null,
        status: STATUS.LOADING,
        singleAnnouncement:null,
    },
    reducers: {
        setAnnouncementData(state, action) {
            state.announcement = action.payload;
        },
        setActiveAnnouncement(state, action) {
            state.activeAnnouncement = action.payload;
        },
        setAnnouncementData(state, action) {
            state.announcement = action.payload;
        },
        setSingleAnnouncement(state, action) {
            state.singleAnnouncement = action.payload;
        },
        setStatus(state, action) {
            state.status = action.payload;
        },
        resetStatus(state) {
            state.status = STATUS.LOADING;
          },
        setUpdateAnnouncement(state, action) {
            const index = state.announcement.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.announcement[index] = {
                    ...state.announcement[index],
                    ...action.payload.data,
                };
            }
        },
        setDeleteAnnouncement(state, action) {
            state.announcement = state.announcement.filter(item => item.bannerAnnouncementId !== action.payload.bannerAnnouncementId);  
        }
        
    },
});



export const {
    setAnnouncementData,
    setSingleAnnouncement,
    setStatus,
    setDeleteAnnouncement,
    setUpdateAnnouncement,
    resetStatus, setActiveAnnouncement
} = announcementSlice.actions;

export default announcementSlice.reducer;

// Add announcement
export function addAnnouncement(announcementData) {
    return async function addAnnouncementThunk(dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await APIAuthenticated.post("/api/banner-announcement/create", announcementData);
            if (response.status === 200) {
                dispatch(setStatus(STATUS.SUCCESS));
                dispatch(listAllAnnouncement());
            } else {
                dispatch(setStatus(STATUS.ERROR));
            }
        } catch (err) {
            console.error(err);
            dispatch(setStatus(STATUS.ERROR));
        }
    };
}

// fetch active announcement
export function listActiveAnnouncement() {
    return async function listActiveAnnouncementThunk(dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await API.get("/api/banner-announcement/getActiveAnnouncement");
            if (response.status === 200) {
                dispatch(setActiveAnnouncement(response.data));
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
// List All Books
export function listAllAnnouncement() {
    return async function listAllAnnouncementThunk(dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await API.get("/api/banner-announcement/getAllAnnouncement");
            console.log("response", response)
            if (response.status === 200) {
                dispatch(setAnnouncementData(response.data));
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

// Get Single announcement
export function listSingleAnnouncement(bannerAnnouncementId) {
    return async function listSingleAnnouncementThunk(dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await APIAuthenticated.get(`/api/banner-announcement/singleAnnouncement/${bannerAnnouncementId}`);
            if (response.status === 200) {
                dispatch(setSingleAnnouncement(response.data.data));
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

// Delete announcement
export function deleteAnnouncement(bannerAnnouncementId) {
    return async function deleteAnnouncementThunk(dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await APIAuthenticated.delete(`/api/banner-announcement/delete/${bannerAnnouncementId}`);
            if (response.status === 200) {
                dispatch(setDeleteAnnouncement({ bannerAnnouncementId }));
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

// Update announcement
export function updateAnnouncement({ id, announcementData }) {
    return async function updateAnnouncementThunk(dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await APIAuthenticated.patch(`/api/banner-announcement/update/${id}`, announcementData
            );
            if (response.status === 200) {
                dispatch(setUpdateAnnouncement({ id, data: response.data.data }));
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
