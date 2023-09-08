const { createSlice } = require("@reduxjs/toolkit");

const tourSlice = createSlice({
    name: 'tour',
    initialState:{
        token: '',
        loginStatus: false,
        userId: "0"
    },
    reducers:{
        addToken: (state, action) =>{
            state.token = action.payload;
        },
        addLoginStatus: (state, action) =>{
            console.log('action',action.payload);
            state.loginStatus = action.payload;
        },
        addUserId: (state, action) =>{
            console.log('action',action.payload);
            state.userId = action.payload;
        }
        
    }
})

export const { addToken, addLoginStatus, addUserId } = tourSlice.actions;

export default tourSlice.reducer;