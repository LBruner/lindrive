import {createSlice} from "@reduxjs/toolkit";

const initialNotification = {
    details: {
        title: '',
        message: '',
        status: ''
    },
    timer: 0
}

const uiSlice = createSlice({
    name: 'notification', initialState: {
        activeNotification: initialNotification,
        showNotification: false,
        isWaiting: false,
    }, reducers: {
        showNotification(state, action) {
            state.showNotification = true;
            const {notification} = action.payload;
            state.activeNotification = notification;
        },
        hideNotification(state) {
            state.showNotification = false;
            state.activeNotification.details = initialNotification.details;
            state.activeNotification.timer = 0;
        },
        toggleIsWaiting(state) {
            state.isWaiting = !state.isWaiting;
        },
    }
})

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;