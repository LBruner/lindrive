import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useLocation, useNavigate} from "react-router-dom";
import AlertModal from "../UI/AlertModal";

const Navbar: React.FC = _ => {
    const navigate = useNavigate();
    const location = useLocation();

    const activeTabColor = "rgb(36,75,229)";
    const unActiveTabColor = "rgb(36,120,229)";

    const onGoToPathHandler = (path: string) => {
        navigate(path);
    }

    return (
        <nav className="d-lg-block d-md-flex bg-light  justify-content-center" style={{width: '10%'}}>
            <div className="position-fixed d-flex flex-column justify-content-between" style={{height: '100%'}}>
                <ul className="nav flex-column text-center">
                    <li className="nav-item my-bg-0">
                        <a className="nav-link">
                            <FontAwesomeIcon icon={'fa-hard-drive'} className={'active'} size={"2x"}/>
                        </a>
                    </li>
                    <hr/>
                    <li className="nav-item my-bg-0">
                        <a className="nav-link">
                            <FontAwesomeIcon icon={'fa-home'}
                                             color={location.pathname === '/home' ? activeTabColor : unActiveTabColor}
                                             size={"xl"} onClick={onGoToPathHandler.bind(null, 'home')}/>
                        </a>
                    </li>
                    <li className="nav-item my-bg-0">
                        <a className="nav-link">
                            <FontAwesomeIcon icon={'fa-folder'}
                                             color={location.pathname === '/trackingFolders' ? activeTabColor : unActiveTabColor}
                                             size={"xl"} onClick={onGoToPathHandler.bind(null, 'trackingFolders')}/>
                        </a>
                    </li>
                    <li className="nav-item my-bg-0">
                        <a className="nav-link" href="#">
                            <FontAwesomeIcon icon={'fa-moon'}
                                             color={location.pathname === '/moon' ? activeTabColor : unActiveTabColor}
                                             size={"2x"}/>
                        </a>
                    </li>
                </ul>
                <ul className="nav flex-column text-center">
                    <hr/>
                    <li className="nav-item">
                        <a className="nav-link">
                            <FontAwesomeIcon icon={'fa-right-from-bracket'}
                                             size={"2x"}
                                             onClick={onGoToPathHandler.bind(null, 'logout')}></FontAwesomeIcon>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    )

}

export default Navbar;