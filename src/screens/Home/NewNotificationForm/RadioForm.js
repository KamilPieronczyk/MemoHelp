import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import { frequencyState } from '../../../utils/FirebaseReminders'
import {useRecoilState} from 'recoil'
import { weekDaysState, typeState, Reminder } from '../../../utils/FirebaseReminders'

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
  const [value, setValue] = useRecoilState(frequencyState)
  const [type, setType] = useRecoilState(typeState);

  useEffect(() => {
    if(type != Reminder.reminderTypes.cyclical)
      setValue(null)
  }, [type])

  const handleChange = (event) => {
    if(event.target.value == undefined) return;
    if(value == event.target.value){
      setType(Reminder.reminderTypes.default)
      setValue("");
    } else {
      setType(Reminder.reminderTypes.cyclical)
      setValue(event.target.value);
    }
  };

  return (
    <FormControl component="fieldset">
      <RadioGroup row aria-label="position" name="position" defaultValue="top" value={value} onClick={handleChange}>
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
