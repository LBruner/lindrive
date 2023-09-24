import React, {useEffect, useState} from "react";
import {ClientEvents, ServerEvents} from "../../../events";
import TrackingFolderItem from "./TrackingFolderItem";

interface Folder {
    name: string,
    path: string
}

const TrackingFoldersSettings: React.FC = () => {
    const [trackingFolders, setTrackingFolders] = useState<Folder[]>([])

    useEffect(() => {
        window.Main.send(ClientEvents.getTrackingFolders);

        window.Main.on(ServerEvents.sendTrackingFolders, (trackingFolders: Folder[]) => {
            console.log(trackingFolders)
            setTrackingFolders(trackingFolders);
        });

        window.Main.on(ServerEvents.sendDeletedTrackingFolder, () => {
            window.Main.send(ClientEvents.getTrackingFolders);
        });

        return (() => {
            window.Main.removeAllListeners(ServerEvents.sendTrackingFolders)
            window.Main.removeAllListeners(ServerEvents.sendDeletedTrackingFolder)
            window.Main.removeAllListeners(ClientEvents.getTrackingFolders)
        })
    }, []);

    return (
        <>
            <h6 className={'text-dark alert alert-light'}>Here you can remove folders that you are tracking</h6>
            {trackingFolders.map(folder => <TrackingFolderItem key={folder.name} name={folder.name}
                                                               path={folder.path}/>)}
        </>
    )
}

export default TrackingFoldersSettings;