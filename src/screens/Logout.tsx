import React from "react";
import {ClientEvents} from "../../events";

const Logout: React.FC = _ => {
    const onLogout = () => {
        window.Main.send(ClientEvents.logout);
    }

    return (
        <>
            <h6 className={'alert alert-light'}>Logging out will erase all your data.</h6>
            <button onClick={onLogout} type="button" className="btn btn-danger" data-bs-dismiss="modal"
                    aria-label="Close">Confirm
            </button>
        </>

    )
}

export default Logout;