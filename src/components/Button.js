import React from 'react';
import Button from '@material-ui/core/Button';
import {  makeStyles } from '@material-ui/core/styles';

function Btn(props) {

    const s = {
        borderColor: props.type === 'outlined' ? props.color : 'transparent',
        backgroundColor: props.type === 'contained' ? props.color : 'transparent',
    }

    const useStyles = makeStyles(() => ({
        class: {
          borderRadius: '15px',
          height: '48px',
          ...(props.style)
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