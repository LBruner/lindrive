import {GlobalStyle} from './styles/GlobalStyle'
import Home from "./components/Home";
import {Route, Routes, useNavigate} from "react-router-dom";
import {ClientEvents} from "../events";
import AppSetup from "./components/AppSetup";
import UserLogin from "./components/UserLogin";
import {setupIcons} from "./components/UI/icons";
import TrackingFoldersSettings from "./components/nodes/TrackingFoldersSettings";
import Navbar from "./components/navbar/Navbar";
import styled from 'styled-components';

export function App() {
    const navigate = useNavigate();

    setupIcons();

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

    const ContentDivider = styled.div`
      display: grid;
      grid-template-columns: 6rem 1fr
    `

    return (
        <>
            <GlobalStyle/>
            <ContentDivider>
                <Navbar/>
                <div>
                    <Routes>
                        <Route path="/setup" element={<AppSetup/>}/>
                        <Route path="/login" element={<UserLogin/>}/>
                        <Route path={"/trackingFolders"}
                               element={<TrackingFoldersSettings/>}/>
                        <Route path="/home" element={<Home/>}/>
                    </Routes>
                </div>
            </ContentDivider>
        </>
    )
}