import React, {useEffect, useState} from "react";
import UserDashboard from "./UserDashboard";
import {useNavigate} from "react-router-dom";

export const Home: React.FC = () => {
    return (
        <>
            <UserDashboard/>
        </>
    )
}

export default Home;
