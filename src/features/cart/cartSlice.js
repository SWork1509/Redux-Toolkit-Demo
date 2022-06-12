import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import cartItems from '../../cartItems';
import { openModal } from '../modal/modalSlice';

const initialState = {
    cartItems: [],
    amount: 4,
    total: 0,
    isLoading: true
}

const url = 'https://course-api.com/react-useReducer-cart-project';

export const getCartItems = createAsyncThunk('cart/getCartItems', (name, thunkAPI) => {
    // console.log(thunkAPI);
    return fetch(url)
        .then(resp => {
            // console.log(thunkAPI.getState());
            // thunkAPI.dispatch(openModal())
            return resp.json()
        })
        .catch(err => console.log(err))
})

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCart: (state) => {
            state.cartItems = [];
        },
        removeItem: (state, action) => {
            const itemId = action.payload
            state.cartItems = state.cartItems.filter(item => item.id !== itemId)
        },
        toggleAmount: (state, { payload }) => {
            const itemId = payload.id;
            const ops = payload.ops;
            const cartItem = state.cartItems.find(item => item.id === itemId);
            if (ops === 'INC') {
                cartItem.amount += 1
            }
            if (ops === 'DEC') {
                cartItem.amount -= 1
            }
        },
        calculateTotal: (state) => {
            const { amount, total } = state.cartItems.reduce((final, item) => {
                final.amount += item.amount
                final.total += item.price * item.amount
                return final;
            }, { amount: 0, total: 0 })
            state.amount = amount;
            state.total = total;
        }
    },
    extraReducers: {
        [getCartItems.pending]: (state) => {
            state.isLoading = true
        },
        [getCartItems.fulfilled]: (state, action) => {
            console.log(action);
            state.isLoading = false;
            state.cartItems = action.payload;
        },
        [getCartItems.rejected]: (state) => {
            state.isLoading = false;
        }
    }

})

export const { clearCart, removeItem, toggleAmount, calculateTotal } = cartSlice.actions;
export default cartSlice.reducer;
