import React, {useEffect, useState} from "react";
import {ClientEvents, ServerEvents} from "../../../events";
import TrackingFolderItem from "./TrackingFolderItem";
import AddTrackingFolders from "./AddTrackingFolders";

interface Folder {
    name: string,
    path: string
}

const TrackingFoldersSettings: React.FC = () => {
    const [trackingFolders, setTrackingFolders] = useState<Folder[]>([]);

    useEffect(() => {
        window.Main.on(ServerEvents.sendTrackingFolders, (trackingFolders: Folder[]) => {
            setTrackingFolders(trackingFolders);
        });

        window.Main.on(ServerEvents.sendDeletedTrackingFolder, (trackingFolders: Folder[]) => {
            setTrackingFolders(trackingFolders);
        });

        window.Main.on(ServerEvents.sendAddTrackingFolders, () => {
            window.Main.send(ClientEvents.getTrackingFolders);
        });
        window.Main.send(ClientEvents.getTrackingFolders);

        return (() => {
            window.Main.removeAllListeners(ServerEvents.sendTrackingFolders)
            window.Main.removeAllListeners(ServerEvents.sendDeletedTrackingFolder)
        })
    }, []);

    return (
        <>
            <AddTrackingFolders/>
            <hr className="border border-dark-subtle border-1 opacity-100"/>

            <h6 className={'alert alert-light'}>Here you can add new folders and remove folders the ones you
                are tracking</h6>
            {trackingFolders.length === 0 && <p className={'.text-body-secondary'}>
                You don't have any tracking folder. How about adding some?
            </p>}
            {trackingFolders.map(folder => <TrackingFolderItem key={folder.name} name={folder.name}
                                                               path={folder.path}/>)}
            <div className={'mb-2'}></div>
        </>
    )
}

export default TrackingFoldersSettings;