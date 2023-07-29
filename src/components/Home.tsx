import React, {useEffect, useState} from "react";
import axios, {AxiosResponse} from 'axios';
import UserDashboard from "./UserDashboard";
import UserLogin from "./UserLogin";

export const Home: React.FC = () => {
    const isModalEnabled = new URLSearchParams(location.search).get('settings');

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    console.log("OI")
    useEffect(() => {
        console.log(window.Main);
        window.Main.on('user_returning_login', () =>{
            setIsAuthenticated(true);
            console.log("OIOIOIO")
        })
    }, []);

    const renderComponents = isAuthenticated ? <UserDashboard/> : <UserLogin/>

    return (
        <>
            {renderComponents}
        </>
    )
}

export default Home;
