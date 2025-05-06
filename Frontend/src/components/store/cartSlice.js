import { createSlice } from "@reduxjs/toolkit";
import { STATUS } from "../globals/status/status";
import { API, APIAuthenticated } from "../http";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cart: [],
        singleCart: null,
        status: STATUS.LOADING,   
    },
    reducers: {
        setCartData(state, action) {
            state.cart = action.payload;
        },
        setSingleCart(state, action) {
            state.singleCart = action.payload;
        },
        setStatus(state, action) {
            state.status = action.payload;
        },
        resetStatus(state) {
            state.status = STATUS.LOADING;
          },
        setDeleteItemFromCart(state, action) {
            state.cart = state.cart.filter(item => item.book?.id !== action.payload.bookId);
        },
        setUpdateItem(state, action) {
            const index = state.cart.findIndex(item => item.book.id === action.payload.bookId);
            if (index !== -1) {
                state.cart[index].totalItems = action.payload.quantity;
            }
        },
        
    },
});


export const {
    setCartData,
    setSingleCart,
    setStatus,
    setDeleteItemFromCart,
    setUpdateItem,
    resetStatus
} = cartSlice.actions;


export default cartSlice.reducer;

// Add book to the cart
export function addToCart(bookId, quantity = 1) {
    return async function addToCart(dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await APIAuthenticated.post("/api/cart/addToCart", {
                bookId,
                TotalItems: quantity,
            });
            if (response.status === 200) {
                dispatch(setStatus(STATUS.SUCCESS));
                dispatch(listAllCartItem());
            } else {
                dispatch(setStatus(STATUS.ERROR));
            }
        } catch (err) {
            console.error(err);
            dispatch(setStatus(STATUS.ERROR));
        }
    };
}




// List All cart item
export function listAllCartItem() {
    return async function listAllCartItemThunk(dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await APIAuthenticated.get("/api/cart/getCartItem");
            console.log("Response", response)
        
            if (response.status === 200) {
                dispatch(setCartData(response.data));
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



// remove the book from the cart
export function removeBookFromCart(bookId) {
    return async function removeBookFromCartThunk(dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await APIAuthenticated.delete(`/api/cart/delete/${bookId}`);
            if (response.status === 200) {
                dispatch(setDeleteItemFromCart({ bookId }));
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


//update cart item
export function updateCartItem(bookId, quantity) {
    return async function updateCartItemThunk(dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await APIAuthenticated.patch(`/api/cart/update`, {
                bookId,
                quantity
            });

            if (response.status === 200) {
                dispatch(setUpdateItem({ bookId, quantity }));
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

