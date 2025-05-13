import { createSlice } from "@reduxjs/toolkit";
import { STATUS } from "../globals/status/status";
import { APIAuthenticated } from "../http";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    items: [],
    myOrders: [],
    singleOrder:[],
    orderDetails: [],
    pendingOrders: [],
    deliveredOrders: [],
    cancelOrder:[],
    allOrders: [],
    changeStatus:null,
    status: STATUS.LOADING,
  },
  reducers: {
    setItems(state, action) {
      state.items = action.payload;
    },
    setMyOrders(state, action) {
      state.myOrders = action.payload;
    },
    setSingleOrder(state, action) {
      state.singleOrder = action.payload;
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
    setCancelOrder(state, action) {
      state.cancelOrder = action.payload;
    },
    setAllOrders(state, action) {
      state.allOrders = action.payload;
    },
    setVerifyChangeStatus(state, action) {
      state.changeStatus = action.payload;
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
  setSingleOrder, setCancelOrder, setVerifyChangeStatus
} = orderSlice.actions;

export default orderSlice.reducer;


// Submit a new order
export function submitOrder(orderData) {
    return async function  submitOrderThunk (dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await APIAuthenticated.post("/api/order/place", orderData);
            if (response.status===200) {
                dispatch(setStatus(STATUS.SUCCESS));
                dispatch(setItems(response.data));
            } else {
                dispatch(setStatus(STATUS.ERROR));
            }
        } catch (err) {
            const message = err.response?.data?.message || "Something went wrong!";
            dispatch(setStatus(STATUS.ERROR));
        }
    };
}
// Fetch all orders (Admin)
export function fetchAllOrders() {
    return async function fetchAllOrdersThunk (dispatch) {
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
    return async function  fetchPendingOrdersThunk (dispatch) {
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
    return async function fetchDeliveredOrdersThunk (dispatch) {
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
    return async function cancelOrderThunk (dispatch) {
      dispatch(setStatus(STATUS.LOADING));
      try {
        const response = await APIAuthenticated.patch(`/api/order/cancel/${orderId}`);
        if (response.status === 200) {
          dispatch(setStatus(STATUS.SUCCESS));
        } else {
          dispatch(setStatus(STATUS.ERROR));
        }
      } catch (err) {
        const message = err.response?.data?.message || "Something went wrong!";
        console.error("Error canceling order:", message);
        dispatch(setStatus(STATUS.ERROR));
      }
    };
  }
  
  // Cancel an order
export function fetchCancelledOrder() {
    return async function fetchCancelledOrderThunk(dispatch) {
      dispatch(setStatus(STATUS.LOADING));
      try {
        const response = await APIAuthenticated.get(`/api/order/cancelled`);
        if (response.status === 200) {
          dispatch(setStatus(STATUS.SUCCESS));
          dispatch(setCancelOrder(response.data));

        } else {
          dispatch(setStatus(STATUS.ERROR));
        }
      } catch (err) {
        const message = err.response?.data?.message || "Something went wrong!";
        console.error("Error canceling order:", message);
        dispatch(setStatus(STATUS.ERROR));
      }
    };
  }
  

  // Cancel an order
  export function fetchSingleOrder(orderId) {
    return async function fetchSingleOrderThunk(dispatch) {
      dispatch(setStatus(STATUS.LOADING));
      try {
        const response = await APIAuthenticated.get(`/api/order/${orderId}`);
        if (response.status === 200) {
          dispatch(setStatus(STATUS.SUCCESS));
          dispatch(setSingleOrder(response.data));
        } else {
          dispatch(setStatus(STATUS.ERROR));
        }
      } catch (err) {
        const message = err.response?.data?.message || "Something went wrong!";
        console.error("Error canceling order:", message);
        dispatch(setStatus(STATUS.ERROR));
      }
    };
  }
  
  // staff verify and change the status
export function staffVerifyAndChangeStatus(orderId, code) {
  return async function staffVerifyAndChangeStatusThunk(dispatch) {
    dispatch(setStatus(STATUS.LOADING));
    try {
      const response = await APIAuthenticated.post(`/api/order/staff/validation/${orderId}/${code}`);
      if (response.status === 200) {
        dispatch(setStatus(STATUS.SUCCESS));
      } else {
        dispatch(setStatus(STATUS.ERROR));
      }
    } catch (err) {
      dispatch(setStatus(STATUS.ERROR));
      console.error("Claim verification error:", err);
    }
  };
}
