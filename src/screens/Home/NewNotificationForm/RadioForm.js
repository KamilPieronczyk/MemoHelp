import React, { useState } from 'react';
import styled from 'styled-components';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';

const MyRadio = withStyles({
  root: {
    color: '#9C9083',
    '&$checked': {
      color:'#9C9083',
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

const MyLabel = withStyles({
  root: {
    color: '#9C9083',
  },
})((props) => <FormControlLabel {...props} />);

export default function RadioForm() {
  return (
    <FormControl component="fieldset">
      <RadioGroup row aria-label="position" name="position" defaultValue="top">
        <MyLabel
          value="everyDay"
          control={<MyRadio />}
          label="Codziennie"
          labelPlacement="end"
        />
        <MyLabel
          value="everyWeek"
          control={<MyRadio />}
          label="Co tydzień"
          labelPlacement="end"
        />
        <MyLabel
          value="everyMonth"
          control={<MyRadio />}
          label="Co miesiąc"
          labelPlacement="end"
        />
        <MyLabel
          value="everyYear"
          control={<MyRadio />}
          label="Co rok"
          labelPlacement="end"
        />
      </RadioGroup>
    </FormControl>
  )
}
