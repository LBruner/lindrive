import React from "react";
import {BeatLoader} from "react-spinners";
import {useSelector} from "react-redux";
import {RootState} from "../../store";

const LoadingScreen: React.FC = _ => {
    const appIsLoading = useSelector((state: RootState) => state.loading.isLoading);

    return (
        <div
            className="opacity-75 d-flex align-items-center justify-content-center bg-gradient bg-dark position-fixed w-100 h-100">
            <BeatLoader className={'text-center '} color={'#36d79f'} loading={appIsLoading} size={25}/>
        </div>
    );
}

export default LoadingScreen;