import React from "react";
import UserDashboard from "./UserDashboard";

export const Home: React.FC = () => {
    return (
        <>
            <h6 className={'alert alert-light'}>Here you can look into all your files updates.</h6>
            <UserDashboard/>
        </>
    )
}

export default Home;
