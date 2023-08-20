import React from "react";
import {NodeLog} from "../../../models/nodes/NodeLog";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const NodeStatusItem: React.FC<{data: NodeLog}> = ({data}) => {
    const {name,path,operation,type} = data;
    return (
        <div>
            {type === "FOLDER" ? <FontAwesomeIcon icon={'fa-folder'} size={"1x"}/>
                : <FontAwesomeIcon icon={'fa-file'} size={"1x"}/>}
            <span>{name}</span>
            <span>{path} was {operation}</span>

        </div>
    )
}

export default NodeStatusItem;