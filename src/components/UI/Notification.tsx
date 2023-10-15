import {useDispatch, useSelector} from "react-redux";
import {uiActions} from "../../store/slices/notification";
import {RootState} from "../../store";
import React, {useEffect} from "react";

export interface Notification {
    details: {
        title: string,
        message: string,
        status: string
    },
    timer: number
}

const Notification: React.FC<Notification> = (notification) => {
    const {details, timer} = notification;
    const {title, message, status} = details;

    const enableDarkMode = useSelector((state: RootState) => state.theme.enableDarkMode);
    const dispatch = useDispatch();
    const showNotification = useSelector((state: RootState) => state.ui.showNotification);

    let statusClasses = '';

    if (status === 'success') {
        statusClasses = enableDarkMode ? `bg-success bg-opacity-50 text-emphasis-success` : `bg-success text-white`;
    }

    if (status === 'error') {
        statusClasses = `bg-danger text-white`;
    }

    if (status === 'alert') {
        statusClasses = `bg-info text-dark`;
    }

    const activeClasses = `${statusClasses}`;

    useEffect(() => {
        if (timer) {
            setTimeout(() => {
                dispatch(uiActions.hideNotification());
            }, timer)
        }
    }, [dispatch, timer]);

    const onClickHandler = () => {
        dispatch(uiActions.hideNotification());
    };

    return (
        <>
            {
                showNotification && <div style={{width: '90%', height: '15%', marginLeft: '10%', marginBottom: '1rem'}}
                                         className={`${activeClasses} z-4 position-fixed bottom-0 start-0 d-flex justify-content-sm-between align-items-center p-4 rounded`}
                                         onClick={onClickHandler}>
                    <h2 className={'fs-3'}>{title}</h2>
                    <h4 className={'fs-5'}>{message}</h4>
                </div>
            }
        </>

    );
};

export default Notification;