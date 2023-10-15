import React, {FormEvent, useEffect, useState} from "react";
import {ClientEvents} from "../../../events";
import {useDispatch} from "react-redux";
import {startLoading} from "../../store/slices/loadingSlice";
import FolderSelect from "./FolderSelect";

const AddTrackingFolders: React.FC = _ => {
    const [selectedFoldersPath, setSelectedFoldersPath] = useState<Array<string>>([])
    const dispatch = useDispatch();

    useEffect(() => {
        window.Main.on('selectedFolders', (selectedFolders: string[]) => {
            if (selectedFolders.length === 0) return;

            const uniqueNewFolders = selectedFolders.filter((newFolder) => !selectedFoldersPath.includes(newFolder));
            setSelectedFoldersPath((prevFolders) => [...prevFolders, ...uniqueNewFolders]);
        })

        return (() => {
            window.Main.removeAllListeners('selectedFolders');
        })
    }, [selectedFoldersPath]);

    const onPickFolders = async (event: any) => {
        event.preventDefault();
        window.Main.send('openFolderDialog');
    }

    const resetFolders = () => {
        setSelectedFoldersPath([]);
    }

    const onSubmitHandler = (event: FormEvent) => {
        event.preventDefault();
        window.Main.send(ClientEvents.addTrackingFolders, selectedFoldersPath);
        setSelectedFoldersPath([]);
        dispatch(startLoading());
    }

    const onDeleteFolder = (folderName: string) => {
        const newSelectedFolders = selectedFoldersPath.filter((item) => item !== folderName);
        setSelectedFoldersPath(newSelectedFolders);
    }

    return (
        <>
            <form onSubmit={onSubmitHandler}>
                <FolderSelect selectedFoldersPath={selectedFoldersPath}
                              setSelectedFoldersPath={setSelectedFoldersPath}/>
            </form>
            <button className={'btn btn-primary mt-3 mb-3'} type={'submit'}>Add folders</button>
        </>
    )
}

export default AddTrackingFolders;