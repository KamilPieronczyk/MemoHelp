import React from 'react';
import styled from 'styled-components';

function Button(props) {
    return (
        <Container width={props.width} onClick={props.callback}>
            <Text>{props.text}</Text>
        </Container>
    );
}

const Container = styled.div`
    cursor: pointer;
    border: 2px solid #73909C;
    border-radius: 15px;
    width: ${props=>props.width};
    &:hover {
        background-color: red;
    };
    &:active {
        background-color: blue;
    }
`;

const Text = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    khtml-user-select: none;
    ms-user-select: none;
    user-select: none;
`;
export default  Button;