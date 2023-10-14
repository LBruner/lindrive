import React, {useEffect} from "react";
import {ClientEvents} from "../../../events";
import {startLoading} from "../../store/slices/loadingSlice";
import {useDispatch} from "react-redux";
import AlertModal from "../UI/AlertModal";

interface TrackingFolderProp {
    name: string,
    path: string
}


const TrackingFolderItem: React.FC<TrackingFolderProp> = ({name, path}) => {
    const dispatch = useDispatch();
    const onDeleteTrackingFolder = () => {
        window.Main.send(ClientEvents.deleteTrackingFolder, path);
        dispatch(startLoading());
    };

    useEffect(() => {
        return(window.Main.removeAllListeners(ClientEvents.deleteTrackingFolder))
    }, []);

    return (
        <>
            <AlertModal title={'Attention required'} description={'All the files and folders will be deleted on your Google Drive folder...'}>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal"
                        onClick={onDeleteTrackingFolder}>Delete
                </button>
            </AlertModal>
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