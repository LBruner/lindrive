import React, {useEffect, useState} from "react";
import {ClientEvents, ServerEvents} from "../../../events";
import {NodeLog} from "../../../models/nodes/NodeLog";
import NodeStatusItem from "./NodeStatusItem";

const NodesStatus: React.FC = () => {
    const [nodesLog, setNodesLog] = useState<NodeLog[]>([]);

    console.log(nodesLog)
    useEffect(() => {
        window.Main.on(ServerEvents.sendNodeChanged, (node: NodeLog) => {
            setNodesLog(prevState => [...prevState, node]);
        });

        window.Main.on(ServerEvents.sendLogs, (dayNodes: NodeLog[]) => {
            console.log("GETTING")
            setNodesLog(dayNodes);
        });

        window.Main.send(ClientEvents.getLogs);

        return (() => {
            window.Main.removeAllListeners(ServerEvents.sendLogs);
        })
    }, []);

    return (
        <>
            {nodesLog.length === 0 && <p className={'list-group-item'}>Nothing new here.</p>}
            {nodesLog.length > 0 &&
                <div className="card">
                    <ul className="list-group list-group-flush">
                        {nodesLog.map((nodeLog, index) =>
                            <li key={index} className="list-group-item">
                                <NodeStatusItem data={nodeLog}/>
                            </li>
                        )}
                    </ul>
                </div>
            }
        </>
    )
}

export default NodesStatus;