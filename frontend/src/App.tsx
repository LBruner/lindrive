import React from 'react';
import './App.css';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import {CookiesProvider} from 'react-cookie';

const router = createBrowserRouter([
    {path: '/home', element: <Home/>},
    {path: '/drive/settings', element: <Settings/>}
])

function App() {
    return (
        <CookiesProvider>
            <RouterProvider router={router}/>
        </CookiesProvider>
    );
}

export default App;
