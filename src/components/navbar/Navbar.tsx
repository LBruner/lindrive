import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useNavigate} from "react-router-dom";

const Navbar: React.FC = _ => {
    const navigate = useNavigate();
    const onGoToPathHandler = (path: string) => {
        navigate(path)
    }

    return (
        <nav className="d-lg-block d-md-flex bg-light  justify-content-center" style={{width: '10%'}}>
            <div className="position-fixed d-flex flex-column justify-content-between" style={{height: '100%'}}>
                <ul className="nav flex-column text-center">
                    <li className="nav-item my-bg-0">
                        <a className="nav-link">
                            <FontAwesomeIcon icon={'fa-hard-drive'} size={"2x"}/>
                        </a>
                    </li>
                    <hr/>
                    <li className="nav-item my-bg-0">
                        <a className="nav-link">
                            <FontAwesomeIcon icon={'fa-home'} size={"xl"} onClick={onGoToPathHandler.bind(null, 'home')}/>
                        </a>
                    </li>
                    <li className="nav-item my-bg-0">
                        <a className="nav-link">
                            <FontAwesomeIcon icon={'fa-folder'} size={"xl"} onClick={onGoToPathHandler.bind(null, 'trackingFolders')}/>
                        </a>
                    </li>
                    <li className="nav-item my-bg-0" data-toggle="tooltip" data-placement="top" title="Add Folders">
                        <a className="nav-link">
                            <FontAwesomeIcon icon={'fa-square-plus'} size={"xl"} onClick={onGoToPathHandler.bind(null, 'addTrackingFolders')}/>
                        </a>
                    </li>
                    <li className="nav-item my-bg-0">
                        <a className="nav-link" href="#">
                            <FontAwesomeIcon icon={'fa-moon'} size={"2x"}/>
                        </a>
                    </li>
                </ul>
                    <ul className="nav flex-column text-center">
                        <hr/>
                        <li className="nav-item my-bg-0">
                            <a className="nav-link" href="#">
                                <FontAwesomeIcon icon={'fa-gear'} size={"2x"}/>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                <FontAwesomeIcon icon={'fa-right-from-bracket'} size={"2x"}/>
                            </a>
                        </li>
                    </ul>
            </div>
        </nav>
    )

}

export default Navbar;