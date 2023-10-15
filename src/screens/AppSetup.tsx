import React, {FormEvent, useEffect, useRef, useState} from "react";
import {ClientEvents, ServerEvents} from "../../events";
import {startLoading} from "../store/slices/loadingSlice";
import {useDispatch} from "react-redux";
import FolderSelect from "../components/nodes/FolderSelect";

const AppSetup: React.FC = _ => {
    const [selectedFoldersPath, setSelectedFoldersPath] = useState<Array<string>>([])
    const rootFolderName = useRef<HTMLInputElement>(null);
    const [trackHiddenNodes, setTrackHiddenNodes] = useState<boolean>(false);
    const dispatch = useDispatch();

    const onToggleSwitch = () => {
        setTrackHiddenNodes(prevState => !prevState);
    }

    const onSubmitHandler = (event: FormEvent) => {
        event.preventDefault();
        window.Main.send(ServerEvents.setupStart, {
            rootFolderName: rootFolderName.current?.value || 'Lindrive',
            trackHiddenNodes
        });
        dispatch(startLoading());
    }

    useEffect(() => {
        window.Main.on('selectedFolders', (selectedFolders: string[]) => {
            const uniqueNewFolders = selectedFolders.filter((newFolder) => !selectedFoldersPath.includes(newFolder));
            setSelectedFoldersPath((prevFolders) => [...prevFolders, ...uniqueNewFolders]);
            window.Main.removeAllListeners('selectedFolders')
        });

        window.Main.on(ServerEvents.setupFinished, () => {
            window.Main.send(ClientEvents.addTrackingFolders, selectedFoldersPath);
        });

        return (() => {
            window.Main.removeAllListeners('selectedFolders');
            window.Main.removeAllListeners(ServerEvents.setupFinished);
        })
    }, [selectedFoldersPath]);

    return (
        <div>
            <form onSubmit={onSubmitHandler}>
                <FolderSelect selectedFoldersPath={selectedFoldersPath}
                              setSelectedFoldersPath={setSelectedFoldersPath}/>
                <h5 className={'text-dark alert alert-light'}>Pick a folder name to host all your Google Drive
                    files.</h5>
                <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Lindrive..." aria-label="Username"
                           aria-describedby="basic-addon1"></input>
                </div>
                <h5 className={'text-dark alert alert-light'}>Should hidden files/folders <b>(starts with a dot)</b> be
                    tracked? <label className="toggle-switch">
                        <input type="checkbox" onChange={() => {
                        }} checked={trackHiddenNodes} onClick={onToggleSwitch} className={'p-5'}/>
                    </label></h5>
                <div className={'btn-group'}>
                    <button disabled={selectedFoldersPath.length === 0}
                            className={`btn   p-2 ${selectedFoldersPath.length > 0 ? 'btn-primary' : 'btn-secondary'}`}
                            type={'submit'}>Start
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AppSetup;