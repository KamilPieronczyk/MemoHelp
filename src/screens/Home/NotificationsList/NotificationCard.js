import React, {useState} from 'react'
import styled from 'styled-components'
import TimeIcon from '@material-ui/icons/Timer'
import IconButton from '@material-ui/core/IconButton';
import MoreIcon from '@material-ui/icons/MoreVert';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';



export function NotificationCard(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  let time = props.time
  let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  let timeString = time.toLocaleString("pl-PL", options)

  const handleClose = () => {
    setAnchorEl(null);
  }

  const handleRemove = () => {
    props.value.ref.delete()
    handleClose()
  }

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  }

  return (
    <Container>
      {props.message}
      <Time>
        <TimeIcon />
        <span style={{marginLeft: 7 + 'px'}}>{timeString}</span>
      </Time>
      <MoreIconContainer>
        <MoreIcon onClick={openMenu} />
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleRemove}>Usuń</MenuItem>
        </Menu>
      </MoreIconContainer>
    </Container>
  )
}

const Container = styled.div`
  background-color: #FFFAF5;
  position: relative;
  padding: 15px;
  margin-top: 10px;
  border-radius: 12px;
  font-size: 14px;
  color: rgba(0,0,0,.83);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`

const Time = styled.div`
  padding-top: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const MoreIconContainer = withStyles((theme) => ({
  root: {
    position: 'absolute',
    top: 0,
    right: 0,
    color: 'rgba(0,0,0,.83)',
  },
}))(IconButton);

