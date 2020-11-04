import React from 'react'
import ExpandMore from '@material-ui/icons/ExpandMore'
import ExpandLess from '@material-ui/icons/ExpandLess'
import {makeStyles} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    cursor: 'pointer'
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 5,
  }
}));

export function CollapseButton(props) {
  const styles = useStyles();
  return (
    <div onClick={props.onClick} className={styles.container}>
      {props.expanded == false ? <ExpandMore className={styles.root} /> : <ExpandLess className={styles.root} />}
    </div>
  )
}
