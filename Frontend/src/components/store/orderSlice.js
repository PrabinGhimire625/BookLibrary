import { createSlice } from "@reduxjs/toolkit";
import { STATUS } from "../globals/status/status";
import { APIAuthenticated } from "../http";

const orderSlice = createSlice({
    name: "order",
    initialState: {
        items: [],
        myOrders: [],
        orderDetails: [],
        status: STATUS.LOADING,
    },
    reducers: {
        setItems(state, action) {
            state.items = action.payload;
        },
        setMyOrders(state, action) {
            state.myOrders = action.payload;
        },
        setMyOrderDetails(state, action) {
            state.orderDetails = action.payload;
        },
        setStatus(state, action) {
            state.status = action.payload;
        },
        resetStatus(state) {
            state.status = STATUS.LOADING;
        },
        setDeleteOrder(state, action) {
            // Assuming you're deleting from 'items'
            state.items = state.items.filter(
                item => item.book?.id !== action.payload.orderId
            );
        },
        resetOrderState(state) {
            state.items = [];
            state.myOrders = [];
            state.orderDetails = [];
            state.status = STATUS.LOADING;
        }
    },
});

export const {
    setItems,
    setMyOrders,
    setMyOrderDetails,
    setStatus,
    resetStatus,
    setDeleteOrder,
    resetOrderState,
} = orderSlice.actions;

export default orderSlice.reducer;

// Submit a new order
export function submitOrder(orderData) {
    return async function (dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await APIAuthenticated.post("/api/order/place", orderData);
            if (response.status===200) {
                dispatch(setStatus(STATUS.SUCCESS));
                dispatch(setItems(response.data));
                // toast.success("Order placed successfully!");
            } else {
                dispatch(setStatus(STATUS.ERROR));
                // toast.error("Failed to place order.");
            }
        } catch (err) {
            const message = err.response?.data?.message || "Something went wrong!";
            console.error("Error submitting order:", message);
            dispatch(setStatus(STATUS.ERROR));
            // toast.error(message);
        }
    };
}

// Fetch all orders of the logged-in customer
export function fetchMyOrder() {
    return async function (dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await APIAuthenticated.get("/api/order/customer");
            if (response.status ===200) {
                dispatch(setStatus(STATUS.SUCCESS));
                dispatch(setMyOrders(response.data));
            } else {
                dispatch(setStatus(STATUS.ERROR));
            }
        } catch (err) {
            console.error("Error fetching my orders:", err.response?.data || err.message);
            dispatch(setStatus(STATUS.ERROR));
        }
    };
}

// Fetch details of a single order
export function fetchMyOrderDetails(id) {
    return async function (dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await APIAuthenticated.get(`/api/order/customer/${id}`);
            if (response.status===200) {
                dispatch(setStatus(STATUS.SUCCESS));
                dispatch(setMyOrderDetails(response.data));
            } else {
                dispatch(setStatus(STATUS.ERROR));
            }
        } catch (err) {
            console.error("Error fetching order details:", err.response?.data || err.message);
            dispatch(setStatus(STATUS.ERROR));
        }
    };
}
