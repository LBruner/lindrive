import React from "react";
import Navbar from "../components/navbar/Navbar";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import AppSetup from "./AppSetup";
import UserLogin from "./UserLogin";
import TrackingFoldersSettings from "../components/nodes/TrackingFoldersSettings";
import AddTrackingFolders from "../components/nodes/AddTrackingFolders";
import Home from "./Home";
import {ClientEvents} from "../../events";

const ScreenManager: React.FC = _ => {
    const navigate = useNavigate();
    const location = useLocation();

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
                    {location.pathname !== '/login' && location.pathname !== '/setup' && <Navbar/>}
                    <main className="col">
                        <h1 className={'p-3'}>
                            {locationTitle}
                        </h1>
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

export default ScreenManager;