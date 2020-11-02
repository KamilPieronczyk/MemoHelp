import React from 'react';
import Button from '@material-ui/core/Button';
import {  makeStyles } from '@material-ui/core/styles';

function Btn(props) {
    
    let s = null;

    if(props.type === 'contained')
        s = {
            backgroundColor: `#${props.css.primary}`
        }
    else {
        s = {
            borderColor: `#${props.css.primary}`,
        }
    }

    const useStyles = makeStyles(() => ({
        class: {
          width: props.css.width,
          color: `#${props.css.color}`,
          borderRadius: '15px',
        },
    }));

    const classes = useStyles();

    return (
        <Button 
            startIcon={props.startIcon} 
            variant={props.type} 
            className={classes.class} 
            style={s}
            onClick={props.onClick}
            endIcon={props.endIcon}
        >
            {props.text}
        </Button>
    );
}

export default Btn;