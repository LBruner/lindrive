import React, {useEffect, useState} from "react";
import {ServerEvents} from "../../../events";
import {NodeLog} from "../../../models/nodes/NodeLog";
import NodeStatusItem from "./NodeStatusItem";

const NodesStatus: React.FC = () => {
    const [nodesLog, setNodesLog] = useState<NodeLog[]>([]);

    useEffect(() => {
        window.Main.on(ServerEvents.sendNodeChanged, (node: NodeLog) => {
            setNodesLog(prevState => [...prevState, node]);
        })

        return (() => {
            window.Main.removeAllListeners(ServerEvents.sendNodeChanged);
        })
    }, []);

    return (
        <div>
            {nodesLog.map((nodeLog, index) =>
                <NodeStatusItem key={index} data={nodeLog}/>)}
        </div>
    )
}

export default NodesStatus;