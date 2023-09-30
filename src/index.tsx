import ReactDOM from "react-dom";
import {App} from "./App";
import {HashRouter} from "react-router-dom";
import {Provider} from "react-redux";
import store from "./store";

ReactDOM.render(
    <HashRouter>
        <Provider store={store}>
            <App/>
        </Provider>
    </HashRouter>, document.getElementById("root")
);
