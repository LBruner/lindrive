import React from "react";
import {ServerEvents} from "../../events";

const UserLogin: React.FC = _ => {
    const onStartLoginHandler = () => {
        window.Main.send(ServerEvents.authStart);
    }

    return (
        <div>
            <h1>Login</h1>
            <button onClick={onStartLoginHandler}>Login</button>
        </div>
    )
}

export default UserLogin;