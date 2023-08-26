import {GlobalStyle} from './styles/GlobalStyle'
import Home from "./components/Home";
import {Route, Routes, useLocation, useNavigate,} from "react-router-dom";
import {ClientEvents} from "../events";
import AppSetup from "./components/AppSetup";
import UserLogin from "./components/UserLogin";
import {setupIcons} from "./components/UI/icons";
import TrackingFoldersSettings from "./components/nodes/TrackingFoldersSettings";
import Navbar from "./components/navbar/Navbar";
import styled from 'styled-components';
import AddTrackingFolders from "./components/nodes/AddTrackingFolders";
import 'bootstrap';
import '../src/styles/styles.scss'

export function App() {
    const navigate = useNavigate();
    const location = useLocation();

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

    const Title = styled.h1`
      padding: 25px;
    `

    let locationTitle = ''

    if (location.pathname === '/home')
        locationTitle = 'Home'
    if (location.pathname === '/addTrackingFolders')
        locationTitle = 'Add Folders'
    if (location.pathname === '/trackingFolders')
        locationTitle = 'All Folders'
    if (location.pathname === '/addTrackingFolders')
        locationTitle = 'Add Folders'


    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <Navbar/>
                    <main className="col">
                        <Title>
                            {locationTitle}
                        </Title>
                        <Routes>
                            <Route path="/setup" element={<AppSetup/>}/>
                            <Route path="/login" element={<UserLogin/>}/>
                            <Route path={"/trackingFolders"}
                                   element={<TrackingFoldersSettings/>}/>
                            <Route path={"/addTrackingFolders"}
                                   element={<AddTrackingFolders/>}/>
                            <Route path="/home" element={<Home/>}/>
                        </Routes>
                    </main>
                </div>
            </div>
        </>
    )
}