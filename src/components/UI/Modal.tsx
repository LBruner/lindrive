import React from "react";
import styled from 'styled-components';

const Modal: React.FC = ({children}) => {
    const MainContainer = styled.div`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100%;
    `

    return (
        <MainContainer>
            {children}
        </MainContainer>
    )
}

export default Modal;