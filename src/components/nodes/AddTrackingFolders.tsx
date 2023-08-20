import React, {FormEvent, useEffect, useState} from "react";
import styled from 'styled-components';
import {ClientEvents, ServerEvents} from "../../../events";

const AddTrackingFolders: React.FC = _ => {
    const [selectedFoldersPath, setSelectedFoldersPath] = useState<Array<string>>([])

    useEffect(() => {
        window.Main.on('selectedFolders', (selectedFolders: string[]) => {
            if (selectedFolders.length === 0) return;

            const uniqueNewFolders = selectedFolders.filter((newFolder) => !selectedFoldersPath.includes(newFolder));
            setSelectedFoldersPath((prevFolders) => [...prevFolders, ...uniqueNewFolders]);
            window.Main.removeAllListeners('selectedFolders')
        })
    }, [selectedFoldersPath]);

    const Form = styled.form`

    `

    const onPickFolders = async (event: any) => {
        event.preventDefault();
        window.Main.send('openFolderDialog')
    }

    const onSubmitHandler = (event: FormEvent) => {
        event.preventDefault();
        console.log("SUBMIT")
        window.Main.send(ClientEvents.addTrackingFolders, selectedFoldersPath)
    }

    return (
        <Form onSubmit={onSubmitHandler}>
            <button type={'button'} onClick={onPickFolders}>
                Select Folders
            </button>
            {selectedFoldersPath.map((item, index) => {
                return <p key={index}>{item}</p>
            })}
            <button type={'submit'}>
                Add Folders
            </button>
        </Form>
    )
}

export default AddTrackingFolders;