import React, {useEffect, useState} from "react";
import {ClientEvents, ServerEvents} from "../../../events";
import {NodeLog} from "../../../models/nodes/NodeLog";
import NodeStatusItem from "./NodeStatusItem";
import styled from "styled-components";

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

        return(() =>{
            window.Main.removeAllListeners(ServerEvents.sendLogs);
        })
    }, []);

    const Container = styled.div`
      padding: 40px;
      display: flex;
      justify-content: flex-start;
      gap: 40px;
      overflow: auto;
      flex-direction: column;
      border-radius: 10px;
      background-color: rgba(176, 181, 181, 0.11);
      height: 90vh;
    `

    return (
        <Container>
            {nodesLog.map((nodeLog, index) =>
                <NodeStatusItem key={index} data={nodeLog}/>)}
        </Container>
    )
}

export default NodesStatus;