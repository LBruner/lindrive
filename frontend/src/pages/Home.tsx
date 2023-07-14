import React, {useEffect, useState} from "react";
import axios, {AxiosResponse} from 'axios';
import {useCookies} from "react-cookie";
import {useLocation} from "react-router-dom";

export const Home: React.FC = () => {
    const [cookies, setCookies] = useCookies(['isAuthenticated']);

    const location = useLocation();
    const isModalEnabled = new URLSearchParams(location.search).get('settings');

    console.log(location)
    useEffect(() => {
        const checkUser = async () => {
            if (!cookies.isAuthenticated) {
                setCookies('isAuthenticated', 'false');
            }

            if (cookies.isAuthenticated == 'false') {
                const response: AxiosResponse<{
                    authUrl: string
                }> = await axios.get('http://localhost:8080/auth/google');
                window.location.href = response.data.authUrl;
            }
        }
        checkUser()
    }, [])

    return (
        <h1>HOME</h1>
    )
}

export default Home;
