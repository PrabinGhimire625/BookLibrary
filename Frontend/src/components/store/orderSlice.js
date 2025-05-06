import { createSlice } from "@reduxjs/toolkit";
import { STATUS } from "../globals/status/status";
import { APIAuthenticated } from "../http";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    items: [],
    myOrders: [],
    orderDetails: [],
    pendingOrders: [],
    deliveredOrders: [],
    allOrders: [],
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
    setPendingOrders(state, action) {
      state.pendingOrders = action.payload;
    },
    setDeliveredOrders(state, action) {
      state.deliveredOrders = action.payload;
    },
    setAllOrders(state, action) {
      state.allOrders = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    resetStatus(state) {
      state.status = STATUS.LOADING;
    },
    setDeleteOrder(state, action) {
      state.items = state.items.filter(
        item => item.orderId !== action.payload.orderId
      );
    },
    resetOrderState(state) {
      state.items = [];
      state.myOrders = [];
      state.orderDetails = [];
      state.pendingOrders = [];
      state.deliveredOrders = [];
      state.allOrders = [];
      state.status = STATUS.LOADING;
    }
  },
});

export const {
  setItems,
  setMyOrders,
  setMyOrderDetails,
  setPendingOrders,
  setDeliveredOrders,
  setAllOrders,
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
// Fetch all orders (Admin)
export function fetchAllOrders() {
    return async function (dispatch) {
      dispatch(setStatus(STATUS.LOADING));
      try {
        const response = await APIAuthenticated.get("/api/order/getAll");
        if (response.status === 200) {
          dispatch(setStatus(STATUS.SUCCESS));
          dispatch(setAllOrders(response.data));
        } else {
          dispatch(setStatus(STATUS.ERROR));
        }
      } catch (err) {
        console.error("Error fetching all orders:", err.response?.data || err.message);
        dispatch(setStatus(STATUS.ERROR));
      }
    };
  }
// Fetch pending orders for logged-in user
export function fetchPendingOrders() {
    return async function (dispatch) {
      dispatch(setStatus(STATUS.LOADING));
      try {
        const response = await APIAuthenticated.get("/api/order/pending");
        if (response.status === 200) {
          dispatch(setStatus(STATUS.SUCCESS));
          dispatch(setPendingOrders(response.data));
        } else {
          dispatch(setStatus(STATUS.ERROR));
        }
      } catch (err) {
        console.error("Error fetching pending orders:", err.response?.data || err.message);
        dispatch(setStatus(STATUS.ERROR));
      }
    };
  }
  

  // Fetch delivered orders for logged-in user
export function fetchDeliveredOrders() {
    return async function (dispatch) {
      dispatch(setStatus(STATUS.LOADING));
      try {
        const response = await APIAuthenticated.get("/api/order/delivered");
        console.log("Response on the delivered orders", response)
        if (response.status === 200) {
          dispatch(setStatus(STATUS.SUCCESS));
          dispatch(setDeliveredOrders(response.data));
        } else {
          dispatch(setStatus(STATUS.ERROR));
        }
      } catch (err) {
        console.error("Error fetching delivered orders:", err.response?.data || err.message);
        dispatch(setStatus(STATUS.ERROR));
      }
    };
  }
  
  // Cancel an order
export function cancelOrder(orderId) {
    return async function (dispatch) {
      dispatch(setStatus(STATUS.LOADING));
      try {
        const response = await APIAuthenticated.patch(`/api/order/cancel/${orderId}`);
        if (response.status === 200) {
          dispatch(setStatus(STATUS.SUCCESS));
          dispatch(setDeleteOrder({ orderId }));
          // Optionally: toast.success("Order cancelled successfully!");
        } else {
          dispatch(setStatus(STATUS.ERROR));
          // Optionally: toast.error("Failed to cancel order.");
        }
      } catch (err) {
        const message = err.response?.data?.message || "Something went wrong!";
        console.error("Error canceling order:", message);
        dispatch(setStatus(STATUS.ERROR));
        // Optionally: toast.error(message);
      }
    };
  }
  
