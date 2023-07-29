import React from "react";

const UserLogin: React.FC = _ => {
    const onStartLoginHandler = () => {
        window.Main.send('auth-start');
    }

    return (
        <div>
            <h1>Login</h1>
            <button onClick={onStartLoginHandler}>Login</button>
        </div>
    )
}

export default UserLogin;