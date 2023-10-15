import {setupIcons} from "./components/UI/icons";
import '../src/styles/styles.scss'
import ScreenManager from "./screens/ScreenManager";
import LoadingScreen from "./components/UI/LoadingScreen";
import 'bootstrap';
import DarkModeToggle from "./components/UI/DarkModeToggle";

export function App() {
    setupIcons();

    return (
        <>
            <DarkModeToggle/>
            <div className="container-fluid">
                <div className="row">
                    <ScreenManager/>
                    <LoadingScreen/>
                </div>
            </div>
        </>
    )
}