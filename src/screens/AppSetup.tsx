import React, {FormEvent, useEffect, useRef, useState} from "react";
import {ClientEvents, ServerEvents} from "../../events";
import {startLoading} from "../store/slices/loadingSlice";
import {useDispatch} from "react-redux";

const AppSetup: React.FC = _ => {
    const [selectedFoldersPath, setSelectedFoldersPath] = useState<Array<string>>([])
    const rootFolderName = useRef<HTMLInputElement>(null);

    const dispatch = useDispatch();
    const onPickFolders = async (event: any) => {
        event.preventDefault();
        window.Main.send('openFolderDialog')
    }

    const onSubmitHandler = (event: FormEvent) => {
        event.preventDefault();
        window.Main.send(ServerEvents.setupStart, {
            rootFolderName: rootFolderName.current?.value || 'Lindrive',
            //TODO: Pick hidden files
        });
        dispatch(startLoading());
        window.Main.send(ClientEvents.addTrackingFolders, selectedFoldersPath);
    }

    useEffect(() => {
        window.Main.on('selectedFolders', (selectedFolders: string[]) => {
            const uniqueNewFolders = selectedFolders.filter((newFolder) => !selectedFoldersPath.includes(newFolder));
            setSelectedFoldersPath((prevFolders) => [...prevFolders, ...uniqueNewFolders]);
            window.Main.removeAllListeners('selectedFolders')
        })
    }, [selectedFoldersPath]);

    return (
        <div>
            <div>
                <h1>Welcome to Lindrive!</h1>
                <form onSubmit={onSubmitHandler}>
                    <label htmlFor={'savingFolders'}>Pick folders to track changes:</label>
                    <button onClick={onPickFolders}>Click</button>
                    <label htmlFor={'rootFolderName'}>Pick a name for the root folder:</label>
                    <input placeholder={'Lindrive'} id={'rootFolderName'} ref={rootFolderName} name={'rootFolderName'}/>
                    <select>
                        <option>Save hidden files</option>
                        <option>Don't save hidden files</option>
                    </select>
                    {selectedFoldersPath.map((item, index) => {
                        return <p key={index}>{item}</p>
                    })}
                    <button type={'submit'}>Start</button>
                </form>
            </div>
        </div>
    )
}

export default AppSetup;