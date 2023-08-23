import React from "react";
import {NodeLog} from "../../../models/nodes/NodeLog";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const NodeStatusItem: React.FC<{ data: NodeLog }> = ({data}) => {
    const {name, path, operation, type} = data;

    const nodeIcon = type === 'FOLDER' ? <FontAwesomeIcon icon={'fa-folder'} size={"1x"}/>
        : <FontAwesomeIcon icon={'fa-file'} size={"1x"}/>

    let operationIcon;

    if (operation === 'ADD') {
        operationIcon = <FontAwesomeIcon icon={'fa-plus'} size={"1x"}/>
    } else if (operation === 'DELETE') {
        operationIcon = <FontAwesomeIcon icon={'fa-minus'} size={"1x"}/>
    } else {
        operationIcon = <FontAwesomeIcon icon={'fa-arrow-rotate-right'} size={"1x"}/>
    }

    return (
        <div>
            {nodeIcon}
            {operationIcon}
            <span>{name}</span>
            <span>{path} was {operation}</span>
        </div>
    )
}

export default NodeStatusItem;