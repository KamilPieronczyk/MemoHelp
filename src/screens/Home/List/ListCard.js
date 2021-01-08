import React, { useState } from 'react'
import styled from 'styled-components'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import DeleteIcon from '@material-ui/icons/Delete';

import Checkbox from '@material-ui/core/Checkbox';
import { Collapse } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

function ListCardBtn(props) {
  const [state, setState] = useState({
    checked: false
  });
  const ChangeCheckbox = (e) => {
    console.log("Change checkbox 1");
    let b = state.checked;
    setState({ ...state, checked: !b});
  }
  return(
    <CheckBoxBtn onClick={ChangeCheckbox}>
      <Checkbox
        checked={state.checked}
        name={props.name}
        style={{
          color: '#323232'
        }}
      />
      <CheckBoxText>{props.text}</CheckBoxText>
    </CheckBoxBtn>
  );
}

export function ListCard(props) {
  const [myArray, setMyArray] = useState(new Array());
  const [state, setState] = useState({
    isOpen: false
  });

  const ExpandLessInfo = (e) => {
    console.log("Show less");
    setState({ ...state, isOpen: false});
  }

  const ExpandMoreInfo = (e) => {
    console.log("Show more");
    setMyArray(props.myArray)
    setState({ ...state, isOpen: true});
  }
  const DeleteList = (e) => {
    console.log("Delete List");
  }

  return (
    <Container key={props.id}>
      <Header>
        <span>{props.title}</span><DeleteIconContainer onClick={DeleteList}> </DeleteIconContainer>
        { state.isOpen === true &&
          
          <ExpandLessIconContainer onClick={ExpandLessInfo}> 
          </ExpandLessIconContainer>
        }
        { state.isOpen === false &&
          <ExpandMoreIconContainer onClick={ExpandMoreInfo}>
          </ExpandMoreIconContainer>
        }
      </Header>
      
      <Collapse in={state.isOpen} timeout={"auto"} style={{minWidth: '100%', margin: 0, padding: 0}}>
          <MoreContent>

            {/* TODO: MAP  */}
            {myArray}
            {/* <ListCardBtn text="BTN 1" name="btn1" /> */}

          </MoreContent>
      </Collapse>
    </Container>
  )
}

const CheckBoxText = styled.span`
  color: #FFFAF5;
  font-size: 16px;
  font-weight: 550;
  user-select: none;
`;

const CheckBoxBtn = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: 8px;
  border-radius: 12px;
  background-color: #9C9083;
  width: 95%;
  cursor: pointer;
`;
const DeleteIconContainer = withStyles((theme) => ({
  root: {
    position: 'absolute',
    top: 0,
    right: 20,
    color: '#73909C',
    cursor: 'pointer',
  },
}))(DeleteIcon);
const ExpandMoreIconContainer = withStyles((theme) => ({
  root: {
    position: 'absolute',
    top: 0,
    right: 0,
    color: '#73909C',
    cursor: 'pointer',
  },
}))(ExpandMoreIcon);

const ExpandLessIconContainer = withStyles((theme) => ({
  root: {
    position: 'absolute',
    top: 0,
    right: 0,
    color: '#73909C',
    cursor: 'pointer',
  },
}))(ExpandLessIcon);

const MoreContent = styled.div`
  min-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  background-color: #FFFAF5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  margin-top: 10px;
  border-radius: 12px;
  font-size: 14px;
  color: rgba(0,0,0,.83);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`

const Header = styled.div` 
  color: #73909C;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%
`
