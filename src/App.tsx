import {GlobalStyle} from './styles/GlobalStyle'
import Home from "./components/Home";
import {Route, Routes, useNavigate} from "react-router-dom";
import {ClientEvents} from "../events";
import AppSetup from "./components/AppSetup";
import UserLogin from "./components/UserLogin";
import {useEffect} from "react";

export function App() {
    const navigate = useNavigate();

    window.Main.on(ClientEvents.initialSetup, () => {
        console.log("First Login Client")
        navigate('/setup')
    });

    window.Main.on(ClientEvents.startApp, () => {
        console.log("Returned Login Client")
        navigate('/home')
    });

    window.Main.on(ClientEvents.loadLoginPage, () => {
        navigate('/login')
    });

    return (
        <>
            <GlobalStyle/>
            <div>
                <Routes>
                    <Route path="/setup" element={<AppSetup/>}/>
                    <Route path="/login" element={<UserLogin/>}/>
                    <Route path="/home" element={<Home/>}/>
                </Routes>
            </div>
        </>
    )
}