const { createSlice } = require("@reduxjs/toolkit");

const tourSlice = createSlice({
    name: 'tour',
    initialState:{
        token: '',
        loginStatus: false
    },
    reducers:{
        addToken: (state, action) =>{
            // console.log('action', action.payload);
            state.token = action.payload;
        },
        addLoginStatus: (state, action) =>{
            console.log('action', action.payload);
            state.loginStatus = action.payload;
        }
        
    }
})

export const { addToken, addLoginStatus } = tourSlice.actions;

export default tourSlice.reducer;