import {configureStore} from '@reduxjs/toolkit';
import loadingReducer from './slices/loadingSlice';
import UIReducer from './slices/notification';

const store = configureStore({
    reducer: {
        loading: loadingReducer,
        ui: UIReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;