import {configureStore} from '@reduxjs/toolkit';
import loadingReducer from './slices/loadingSlice';
import UIReducer from './slices/notification';
import themeReducer from './slices/themeSlice';

const store = configureStore({
    reducer: {
        loading: loadingReducer,
        ui: UIReducer,
        theme: themeReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;