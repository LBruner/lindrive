import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import TrackingFolderItem from "./TrackingFolderItem";
import Modal from "../UI/Modal";
import {ClientEvents, ServerEvents} from "../../../events";

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

        window.Main.on(ServerEvents.sendDeletedTrackingFolder, (deletedPath: string) => {
            const newTrackingFolders = trackingFolders.filter(folder => folder.path !== deletedPath);
            setTrackingFolders(newTrackingFolders);
        });

        return (() => {
            window.Main.removeAllListeners(ServerEvents.sendTrackingFolders)
            window.Main.removeAllListeners(ServerEvents.sendDeletedTrackingFolder)
            window.Main.removeAllListeners(ClientEvents.getTrackingFolders)
        })
    }, []);


    const MainContainer = styled.div`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100%;
    `

    const Wrapper = styled.div`
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 10% 80%;
      background-color: azure;
      padding: 15px;
      width: 40rem;
      height: 30rem;
      border-radius: 10px;
    `

    const UpperContainer = styled.div`
      height: 100%;
      display: grid;
      grid-template-columns: 1fr 3%;
      padding: 15px;
    `

    const BottomContainer = styled.div`
      display: grid;
      flex-direction: column;
      padding: 10px;
      gap: 5px;
    `

    return (
        <Modal>
            <MainContainer>
                <Wrapper>
                    <UpperContainer>
                        <p>Tracking Folders</p>
                        <FontAwesomeIcon icon={'fa-x'} size={"1x"}/>
                    </UpperContainer>
                    <BottomContainer>
                        {trackingFolders.map(folder => <TrackingFolderItem key={folder.name} name={folder.name}
                                                                           path={folder.path}/>)}
                    </BottomContainer>
                </Wrapper>
            </MainContainer>
        </Modal>
    )
}

export default TrackingFoldersSettings;