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

    const onSubmitHandler = (event: FormEvent) => {
        event.preventDefault();
        window.Main.send(ClientEvents.addTrackingFolders, selectedFoldersPath);
        setSelectedFoldersPath([]);
        dispatch(startLoading());
    }

    return (
        <>
            <form onSubmit={onSubmitHandler}>
                <FolderSelect selectedFoldersPath={selectedFoldersPath}
                              setSelectedFoldersPath={setSelectedFoldersPath}/>

            {selectedFoldersPath.length > 0 &&
                <button className={'btn btn-primary mt-3 mb-3'} type={'submit'}>{`Add folder${selectedFoldersPath.length > 1 ? 's' : ''}`}</button>}
            </form>
        </>
    )
}

export default AddTrackingFolders;