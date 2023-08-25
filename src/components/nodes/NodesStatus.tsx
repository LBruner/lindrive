import React, {useEffect, useState} from "react";
import {ClientEvents, ServerEvents} from "../../../events";
import {NodeLog} from "../../../models/nodes/NodeLog";
import NodeStatusItem from "./NodeStatusItem";

const NodesStatus: React.FC = () => {
    const [nodesLog, setNodesLog] = useState<NodeLog[]>([]);

    useEffect(() => {
        window.Main.on(ServerEvents.sendNodeChanged, (node: NodeLog) => {
            setNodesLog(prevState => [...prevState, node]);
        });

        window.Main.on(ServerEvents.sendLogs, (dayNodes: NodeLog[]) => {
            console.log("GETTING")
            setNodesLog(dayNodes);
        });

        window.Main.send(ClientEvents.getLogs);

        return(() =>{
            window.Main.removeAllListeners(ServerEvents.sendLogs);
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