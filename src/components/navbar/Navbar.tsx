import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toggleDarkMode} from "../../store/slices/themeSlice";
import {RootState} from "../../store";

const Navbar: React.FC = _ => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const onGoToPathHandler = (path: string) => {
        navigate(path);
    }
    const enableDarkMode = useSelector((state: RootState) => state.theme.enableDarkMode);

    const onToggleDarkMode = () => {
        dispatch(toggleDarkMode());
    }

    return (
        <nav className="d-lg-block d-md-flex justify-content-center" style={{width: '10%'}}>
            <div
                className="position-fixed d-flex flex-column align-items-center justify-content-between m-auto"
                style={{height: '100%'}}>
                <ul className="nav flex-column text-center">
                    <li className="nav-item active">
                        <a className="nav-link">
                            <FontAwesomeIcon icon={'fa-cloud-arrow-up'} className={'active mt-2'} size={"xl"}/>
                        </a>
                    </li>
                    <hr/>
                    <li className="nav-item my-bg-0 disabled">
                        <a className="nav-link btn-primary">
                            <FontAwesomeIcon icon={'fa-home '}
                                             size={"xl"} onClick={onGoToPathHandler.bind(null, 'home')}/>
                        </a>
                    </li>
                    <li className="nav-item my-bg-0">
                        <a className="nav-link">
                            <FontAwesomeIcon icon={'fa-folder'}
                                             size={"xl"} onClick={onGoToPathHandler.bind(null, 'trackingFolders')}/>
                        </a>
                    </li>
                    <li className="nav-item my-bg-0">
                        <a className="nav-link">
                            {enableDarkMode ? <FontAwesomeIcon icon={'fa-sun'}
                                                               size={"xl"} onClick={onToggleDarkMode}/> :
                                <FontAwesomeIcon icon={'fa-moon'}
                                                 size={"xl"} onClick={onToggleDarkMode}/>}
                        </a>
                    </li>
                </ul>
                <ul className="nav flex-column text-center">
                    <hr/>
                    <li className="nav-item">
                        <a className="nav-link">
                            <FontAwesomeIcon className={'mb-2'} icon={'fa-right-from-bracket'}
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