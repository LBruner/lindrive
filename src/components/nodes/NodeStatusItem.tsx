import React from "react";
import {NodeLog} from "../../../models/nodes/NodeLog";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import styled from "styled-components";

const NodeStatusItem: React.FC<{ data: NodeLog }> = ({data}) => {
    const {name, path, operation, type} = data;

    const nodeIcon = type === 'FOLDER' ? <FontAwesomeIcon icon={'fa-folder'} size={"1x"}/>
        : <FontAwesomeIcon icon={'fa-file'} size={"1x"}/>

    const iconColor = operation === 'ADD' ? 'rgba(122, 199, 76, 0.65)' : operation === 'UPDATE' ? 'rgba(89,196,200,0.55)' : 'rgba(213,95,95,0.65)'

    const IconContainer = styled.span`
      padding: 10px;
      background-color: ${iconColor};
      display: inline-flex;
      gap: 10px;
      border-radius: 10px;
    `

    const Container = styled.div`
      display: flex;
      justify-content: flex-start;
      gap: 20px;
      align-items: center;
    `
    let operationIcon;

    if (operation === 'ADD') {
        operationIcon = <FontAwesomeIcon icon={'fa-plus'} size={"1x"}/>
    } else if (operation === 'DELETE') {
        operationIcon = <FontAwesomeIcon icon={'fa-minus'} size={"1x"}/>
    } else {
        operationIcon = <FontAwesomeIcon icon={'fa-arrow-rotate-right'} size={"1x"}/>
    }

    const fileName = type === 'FILE' ? path.split('/').pop() : name;

    let tooltip = '';

    if (operation === 'ADD') {
        tooltip = `${type === 'FOLDER' ? 'Folder' : 'File'} located at: ${path} was added.`
    } else if (operation === 'UPDATE') {
        tooltip = `${type === 'FOLDER' ? 'Folder' : 'File'} located at: ${path} was updated.`
    } else {
        tooltip = `${type === 'FOLDER' ? 'Folder' : 'File'} located at: ${path} was deleted.`
    }

    return (
        <Container data-toggle="tooltip" data-placement="top" title={tooltip}>
            <IconContainer>
                {nodeIcon}
                {operationIcon}
            </IconContainer>
            <span>{fileName}</span>
        </Container>
    )
}

export default NodeStatusItem;