import React from 'react';

function Button(props) {
    const container = {
        border: '2px solid #73909C',
        borderRadius: '15px',
        width: props.width,
        cursor: 'pointer'
    };
    
    const text = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
        khtmlUserSelect:'none',
        msUserSelect: 'none',
        userSelect:'none',
    };
  
    return (
        <div style={container} onClick={props.callback}>
            <span style={text}>{props.text}</span>
        </div>
    );
}

export default  Button;