import React, {useState, useEffect} from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {useRecoilState} from 'recoil'
import { weekDaysState, typeState, Reminder } from '../../../utils/FirebaseReminders'

const useStyles = makeStyles((theme) => ({
  outlined: {
    borderColor: '#9C9083',
    color: '#9C9083',
  },
  contained: {
    color: '#FFFAF5',
    backgroundColor: '#9C9083',
    '&:hover': {
      backgroundColor: '#8a7a69',
    }
  }
}));

const MyButton = withStyles((theme) => ({
  root: {
    borderRadius: 21,
    height: 42,
    marginRight: 5,
    marginBottom: 5,
  },
}))(Button);

const weekDays = [
  ['mon', 'Poniedziałek'],
  ['tue', 'Wtorek'],
  ['wed', 'Środa'],
  ['thu', 'Czwartek'],
  ['fri', 'Piątek'],
  ['sat', 'Sobota'],
  ['sun', 'Niedziela']
]

export function CheckBoxButton() {
  const classes = useStyles();
  const [state, setState] = useState(new Set())
  const [weekDaysArr, setWeekDaysState] = useRecoilState(weekDaysState);
  const [type, setType] = useRecoilState(typeState);

  useEffect(() => {
    if(type != Reminder.reminderTypes.special) {
      setState(new Set())
      setWeekDaysState(new Array())
    }
    console.log('type', type)
  }, [type])

  useEffect(() => {
    let set = new Set()
    weekDaysArr.forEach(day => {
      set.add(day)
    })
    setState(new Set(set))
  }, [weekDaysArr])

  let getVariant = (weekDay) => {
    return state.has(weekDay) ? 'contained' : 'outlined';
  }

  let toggle = (weekDay) => {
    if (state.has(weekDay))
      state.delete(weekDay)
    else
      state.add(weekDay)
    setState(new Set(state))
    setWeekDaysState(Array.from(state))
    if(state.size > 0) {
      setType(Reminder.reminderTypes.special)
    } else {
      setType(Reminder.reminderTypes.default)
    }
  }
  return (
    <div>
      {
        weekDays.map((day) => <MyButton variant={getVariant(day[0])} className={classes[getVariant(day[0])]} onClick={()=>toggle(day[0])}>{day[1]}</MyButton>)
      }
    </div>
  )
}
