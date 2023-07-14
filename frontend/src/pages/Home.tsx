import React, {useEffect, useState} from "react";
import axios, {AxiosResponse} from 'axios';
import {useCookies} from "react-cookie";

export const Home: React.FC = () => {
    const [cookies, setCookies] = useCookies(['isAuthenticated']);

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
