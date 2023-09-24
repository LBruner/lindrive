import React, {FormEvent, useEffect, useState} from "react";
import {ClientEvents} from "../../../events";

const AddTrackingFolders: React.FC = _ => {
    const [selectedFoldersPath, setSelectedFoldersPath] = useState<Array<string>>([])

    useEffect(() => {
        window.Main.on('selectedFolders', (selectedFolders: string[]) => {
            if (selectedFolders.length === 0) return;

            const uniqueNewFolders = selectedFolders.filter((newFolder) => !selectedFoldersPath.includes(newFolder));
            setSelectedFoldersPath((prevFolders) => [...prevFolders, ...uniqueNewFolders]);
            window.Main.removeAllListeners('selectedFolders')
        })

        return(() =>{
            window.Main.removeAllListeners('selectedFolders')
        })
    }, [selectedFoldersPath]);

    const onPickFolders = async (event: any) => {
        event.preventDefault();
        window.Main.send('openFolderDialog');
    }

    const onSubmitHandler = (event: FormEvent) => {
        event.preventDefault();
        console.log("SUBMIT")
        window.Main.send(ClientEvents.addTrackingFolders, selectedFoldersPath)
    }

    return (
        <>
            <h6 className={'text-dark alert alert-light'}>Here you can remove folders that you are tracking</h6>
            <form onSubmit={onSubmitHandler}>
                <button type={'button'} onClick={onPickFolders}>
                    Select Folders
                </button>
                {selectedFoldersPath.map((item, index) => {
                    return <p key={index}>{item}</p>
                })}
                <button type={'submit'}>Add folders.</button>
            </form>
        </>
    )
}

export default AddTrackingFolders;