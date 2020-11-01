import React from 'react';
import styled from 'styled-components';

/**
 * 
 * @param {css} props
 * css: {
 *  width,
 *  color,
 *  hover: {
 *      backgroundColor,
 *      color
 *  }
 *  active: {
 *      backgroundColor,
 *      color
 *  }
 * }
 */
function Button(props) {
    return (
        <Container {...props.css} onClick={props.callback}>
            <Text>{props.text}</Text>
        </Container>
    );
}

const Container = styled.div`
    cursor: pointer;
    border: 2px solid #73909C;
    border-radius: 15px;
    width: ${p=>p.width};
    color: ${p=>p.color};
    &:hover {
        background-color: ${p=>p.hover.backgroundColor};
        color: ${p=>p.hover.color};
    };
    &:active {
        background-color: ${p=>p.active.backgroundColor};
        color: ${p=>p.active.color};
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