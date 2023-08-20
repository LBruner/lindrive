import React, {useEffect, useState} from "react";
import {ServerEvents} from "../../../events";
import {NodeLog} from "../../../models/nodes/NodeLog";

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
            {nodesLog.map((nodeLog, i) => <div>
                <p key={i}>
                    {nodeLog.name} was {nodeLog.operation}
                </p>
            </div>)}
        </div>
    )
}

export default NodesStatus;