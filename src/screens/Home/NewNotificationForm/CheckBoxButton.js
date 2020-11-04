import React, {useState} from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

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

  let getVariant = (weekDay) => {
    return state.has(weekDay) ? 'contained' : 'outlined';
  }

  let toggle = (weekDay) => {
    if (state.has(weekDay))
      state.delete(weekDay)
    else
      state.add(weekDay)
    setState(new Set(state))
  }
  return (
    <div>
      {
        weekDays.map((day) => <MyButton variant={getVariant(day[0])} className={classes[getVariant(day[0])]} onClick={()=>toggle(day[0])}>{day[1]}</MyButton>)
      }
    </div>
  )
}
