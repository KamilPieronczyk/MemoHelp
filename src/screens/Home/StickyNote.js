import React from 'react'
import IconButton from '@material-ui/core/IconButton';
import MoreIcon from '@material-ui/icons/MoreVert';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components'


export function StickyNote(props) {
  return (
    <Container index={props.index}>
      Tekst
      <MoreIconContainer>
        <MoreIcon />
      </MoreIconContainer>
    </Container>
  )
}

const Container = styled.div`
  grid-area: 1 / span 1;
  grid-row: ${props => props.index + 4} / span 1;
  background-color: #FFFAF5;
  border-radius: 12px;
  box-sizing: border-box;
  position: relative;
  padding: 15px;
  font-size: 14px;
  color: rgba(0,0,0,.83);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`

const MoreIconContainer = withStyles((theme) => ({
  root: {
    position: 'absolute',
    top: 0,
    right: 0,
    color: 'rgba(0,0,0,.83)',
  },
}))(IconButton);