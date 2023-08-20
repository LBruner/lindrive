import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import styled from 'styled-components';
import {useNavigate} from "react-router-dom";

const Navbar: React.FC = _ => {
    const navigate = useNavigate();

    const Container = styled.nav`
      display: flex;
      flex-direction: column;
      height: 100vh;
      justify-content: space-between;
      align-items: center;
      background-color: aliceblue;
    `;
    
    const UpperContainer = styled.div`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
    `

    const BottomContainer = styled.div`
      display: flex;
      flex-direction: column;
      width: 100%;
      align-items: center;
    `

    const Item = styled.div`
      color: black;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;
      padding: 20px;
    `

    const HorizontalLine = styled.hr`
      width: 100%;
    `

    const onGoToPathHandler = (path: string) =>{
        navigate(path)
    }

    return (
        <Container>
            <UpperContainer>
                <Item>
                    <FontAwesomeIcon icon={'fa-hard-drive'} size={"3x"}/>
                </Item>
                <HorizontalLine/>
                <Item>
                    <FontAwesomeIcon icon={'fa-home'} size={"xl"} onClick={onGoToPathHandler.bind(null, 'home')}/>
                </Item>
                <Item>
                    <FontAwesomeIcon icon={'fa-square-plus'} size={"xl"} onClick={onGoToPathHandler.bind(null, 'addTrackingFolders')}/>
                </Item>
                <Item>
                    <FontAwesomeIcon icon={'fa-folder'} size={"xl"} onClick={onGoToPathHandler.bind(null, 'trackingFolders')}/>
                </Item>
                <Item>
                    <FontAwesomeIcon icon={'fa-moon'} size={"xl"}/>
                </Item>
            </UpperContainer>
            <BottomContainer>
                <HorizontalLine/>
                <Item>
                    <FontAwesomeIcon icon={'fa-gear'} size={"xl"}/>
                </Item>
                <Item>
                    <FontAwesomeIcon icon={'fa-right-from-bracket'} size={"xl"}/>
                </Item>
            </BottomContainer>
        </Container>
    )
}

export default Navbar;