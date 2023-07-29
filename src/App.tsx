import {GlobalStyle} from './styles/GlobalStyle'
import Home from "./components/Home";
import {useState} from "react";
import AppSetup from "./components/AppSetup";

export function App() {
    const [isUserFirstLogin, setIsUserFirstLogin] = useState<boolean>(false);

    window.Main.on('user_first_login', () => {
        setIsUserFirstLogin(true);
    })

    const renderingElements = isUserFirstLogin ? <AppSetup/> : <Home/>

    return (
        <>
            <GlobalStyle/>
            {renderingElements}
        </>
    )
}