import React, {useEffect} from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../../store";

const DarkModeToggle: React.FC = () => {
    const enableDarkMode = useSelector((state: RootState) => state.theme.enableDarkMode);

    useEffect(() => {
        console.log(enableDarkMode)
        if (enableDarkMode) {
            document.documentElement.setAttribute('data-bs-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-bs-theme');
        }
    }, [enableDarkMode]);

    return (
        <></>
    );
}

export default DarkModeToggle;
