import React from "react";

interface FolderSelectProps {
    selectedFoldersPath: string[],
    setSelectedFoldersPath: React.Dispatch<React.SetStateAction<string[]>>;
}

const FolderSelect: React.FC<FolderSelectProps> = ({selectedFoldersPath, setSelectedFoldersPath}) => {
    const onPickFolders = async (event: any) => {
        event.preventDefault();
        window.Main.send('openFolderDialog')
    }

    const resetFolders = () => {
        setSelectedFoldersPath([]);
    }

    const onDeleteFolder = (folderName: string) => {
        const newSelectedFolders = selectedFoldersPath.filter((item) => item !== folderName);
        setSelectedFoldersPath(newSelectedFolders);
    }

    return (
        <>
            <h5 className={'text-dark alert alert-light'}>Pick the folders you wish to track.</h5>
            <div className={'d-flex gap-1 '}>
                <button className={'btn btn-secondary mb-3'} type={'button'} onClick={onPickFolders}>
                    Select Folders
                </button>
                {selectedFoldersPath.length > 0 &&
                    <>
                        <button className={'btn btn-secondary mb-3'} type={'button'} onClick={resetFolders}>
                            Reset selected folders
                        </button>
                    </>
                }
            </div>
            {
                selectedFoldersPath.length > 0 &&
                <>
                    <div className="list-group mb-3">
                        <span  className="list-group-item list-group-item-action active z-0"
                                aria-current="true">
                            Folders to add:
                        </span>
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
        </>
    )
}

export default FolderSelect;