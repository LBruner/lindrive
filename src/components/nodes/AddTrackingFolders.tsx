import React, {FormEvent, useEffect, useState} from "react";
import {ClientEvents} from "../../../events";
import {useDispatch} from "react-redux";
import {startLoading} from "../../store/slices/loadingSlice";

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
            <h6 className={'text-dark alert alert-light mb-0'}>Here you can add folders to track</h6>
            <form onSubmit={onSubmitHandler}>
                <div className={'d-flex gap-1'}>
                    <button className={'btn btn-secondary mt-3 mb-3'} type={'button'} onClick={onPickFolders}>
                        Select Folders
                    </button>
                    {selectedFoldersPath.length > 0 &&
                        <>
                            <button className={'btn btn-secondary mt-3 mb-3'} type={'button'} onClick={resetFolders}>
                                Reset selected folders
                            </button>
                            <button className={'btn btn-primary mt-3 mb-3'} type={'submit'}>Add folders</button>
                        </>
                    }

                </div>
                {selectedFoldersPath.length > 0 &&
                    <>
                        <div className="list-group mb-3">
                            <button type="button" className="list-group-item list-group-item-action active"
                                    aria-current="true">
                                Folders to add:
                            </button>
                            {selectedFoldersPath.map((item) => {
                                return (
                                    <div key={item}
                                         className={'list-group-item list-group-item-action d-flex justify-content-between align-items-center'}>
                                        <span>{item}</span>
                                        <button onClick={onDeleteFolder.bind(null, item)} type="button"
                                                className={'btn btn-danger'}>Delete
                                        </button>
                                    </div>
                                )

                            })}
                        </div>
                    </>
                }
            </form>
        </>
    )
}

export default AddTrackingFolders;