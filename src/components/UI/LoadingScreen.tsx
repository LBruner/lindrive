import React, {useEffect} from "react";
import {BeatLoader} from "react-spinners";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {ServerEvents} from "../../../events";
import {stopLoading} from "../../store/slices/loadingSlice";
import {Notification} from "electron";
import {uiActions} from "../../store/slices/notification";

const LoadingScreen: React.FC = _ => {
    const appIsLoading = useSelector((state: RootState) => state.loading.isLoading);
    const dispatch = useDispatch();

    useEffect(() => {
        window.Main.on(ServerEvents.finishedLoading, (notification: Notification) => {
            console.log("ACONTECEU")
            dispatch(stopLoading());

            dispatch(uiActions.showNotification({
                notification
            }));
        })
    }, []);

    if (!appIsLoading)
        return (
            <></>
        )
    return (
        <div
            className="opacity-75 d-flex align-items-center justify-content-center bg-gradient bg-dark position-fixed w-100 h-100">
            <BeatLoader className={'text-center '} color={'#36d79f'} loading={appIsLoading} size={25}/>
        </div>
    );
}

export default LoadingScreen;