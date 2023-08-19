import React from "react";
import styled from 'styled-components';
import {ClientEvents} from "../../../events";

interface TrackingFolderProp {
    name: string,
    path: string
}

const TrackingFolderItem: React.FC<TrackingFolderProp> = ({name, path}) => {
    const Container = styled.div`
      display: flex;
      justify-content: space-evenly;
    `

    const onDeleteTrackingFolder =() =>{
        window.Main.send(ClientEvents.deleteTrackingFolder, path);
    };

    return (
        <Container>
            <div>
                {name}
            </div>
            <div>
                {path}
            </div>
            <button onClick={onDeleteTrackingFolder}>
                Delete
            </button>
        </Container>
    )
}

export default TrackingFolderItem;