import {setupIcons} from "./components/UI/icons";
import '../src/styles/styles.scss'
import ScreenManager from "./screens/ScreenManager";
import LoadingScreen from "./components/UI/LoadingScreen";

export function App() {
    setupIcons();

    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <ScreenManager/>
                    <LoadingScreen/>
                </div>
            </div>
        </>
    )
}