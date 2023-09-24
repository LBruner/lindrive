import React from "react";
import {ClientEvents} from "../../../events";

interface TrackingFolderProp {
    name: string,
    path: string
}

const TrackingFolderItem: React.FC<TrackingFolderProp> = ({name, path}) => {
    const onDeleteTrackingFolder = () => {
        window.Main.send(ClientEvents.deleteTrackingFolder, path);
    };

    return (
        <>
            <div className="modal fade" id="exampleModal" tabIndex={1} aria-labelledby="deleteModal"
                 aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="deleteModal">Warning</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">X
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="shadow-none">
                                <p className={'text-danger fs-4'}>
                                    All the files and folders will be deleted <span className={'fw-bolder'}>on your Google Drive folder</span>.

                                </p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={onDeleteTrackingFolder}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="list-group">
                <div className="list-group-item list-group-item-action" aria-current="true">
                    <div className="d-flex w-100 justify-content-between align-items-center">
                        <h5 className="mb-1">{name}</h5>
                        <button type="button" className="btn btn-danger" data-bs-toggle="modal"
                                data-bs-target="#exampleModal">
                            Delete
                        </button>
                    </div>
                    <p className="mb-1">{path}</p>
                </div>
            </div>
        </>
    )
}

export default TrackingFolderItem;