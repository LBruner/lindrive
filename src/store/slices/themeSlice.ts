import {createSlice} from '@reduxjs/toolkit';

interface ThemeState {
    enableDarkMode: boolean;
}

const initialState: ThemeState = {
    enableDarkMode: false
};

const themeSlice = createSlice({
    name: 'darkMode',
    initialState,
    reducers: {
        toggleDarkMode: (state) => {
            state.enableDarkMode = !state.enableDarkMode;
        }
    },
});

export const {toggleDarkMode} = themeSlice.actions;

export default themeSlice.reducer;
