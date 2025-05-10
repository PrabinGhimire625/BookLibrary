import { createSlice } from "@reduxjs/toolkit";
import { APIAuthenticated } from "../http";
import { STATUS } from "../globals/status/status";

const notificationsSlice = createSlice({
    name: "notifications",
    initialState: {
        notifications: [],
        status: STATUS.LOADING,
        unreadNotification: [],
        unreadCount:0,
    },
    reducers: {
        setNotificationData(state, action) {
            state.notifications = action.payload;
            state.unreadCount = action.payload.filter(n => !n.isRead).length;
        },
        setStatus(state, action) {
            state.status = action.payload;
        },
        setUnreadNotification(state, action) {
            state.unreadNotification = action.payload
        },
        clearUnreadCount(state) {
            state.unreadCount = 0;
            state.unreadNotification = [];
        }

    },
});

export const { setNotificationData, setStatus, clearUnreadCount, setUnreadNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;

//fetch notification of single user
export function fetchAllNotificationsOfSingleUser() {
    return async function (dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await APIAuthenticated.get("/api/notification");
            if (response.status === 200) {
                dispatch(setNotificationData(response.data));
                dispatch(setStatus(STATUS.SUCCESS));
            } else {
                dispatch(setStatus(STATUS.ERROR));
            }
        } catch (err) {
            console.error("Error fetching notifications:", err);
            dispatch(setStatus(STATUS.ERROR));
        }
    };
}

// Mark all as read and refetch
export function markAllNotificationsAsRead() {
    return async function (dispatch) {
        try {
            const response = await APIAuthenticated.patch("/api/notification/read-all");
            if (response.status === 200) {
                dispatch(setStatus(STATUS.SUCCESS));
            } else {
                dispatch(setStatus(STATUS.ERROR));
            }
        } catch (err) {
            dispatch(setStatus(STATUS.ERROR));
        }
    };
}



//fetch notification of single user
export function fetchAllUnReadNotification() {
    return async function (dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await APIAuthenticated.get("/api/notification/unread");
            if (response.status === 200) {
                dispatch(setUnreadNotification(response.data));
                dispatch(setStatus(STATUS.SUCCESS));
            } else {
                dispatch(setStatus(STATUS.ERROR));
            }
        } catch (err) {
            dispatch(setStatus(STATUS.ERROR));
        }
    };
}
