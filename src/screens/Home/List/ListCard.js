import React, { useState } from 'react'
import styled from 'styled-components'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import DeleteIcon from '@material-ui/icons/Delete';
import firebase from 'firebase';

import Checkbox from '@material-ui/core/Checkbox';
import { Collapse } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { useUser } from '../../../utils';
import {useSnackbar} from 'notistack'

function ListCardBtn(props) {
  const [state, setState] = useState(false);
  const ChangeCheckbox = (e) => {
    console.log("Change checkbox 1");
    let b = state;
    setState(!b);
  }
  return(
    <CheckBoxBtn onClick={ChangeCheckbox}>
      <Checkbox
        checked={state}
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
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const {user}=useUser();
  const updateFirestore = (index) => {
    firebase
        .firestore()
        .collection('Users')
        .doc(user.uid)
        .collection('Lists')
        .doc(props.myArray[index].parentID)
        .update({
            myList: props.myArray})
        .then(() => {
        //enqueueSnackbar('Lista została zmieniona', { variant: 'success' })
    }).catch(() => {
        //enqueueSnackbar('blad updateu listy', { variant: 'error' })
    })}
    const updateFirestoreExpand = (myID,myBool) => {
      firebase
          .firestore()
          .collection('Users')
          .doc(user.uid)
          .collection('Lists')
          .doc(myID)
          .update({
              expanded: myBool})
          .then(() => {
          //enqueueSnackbar('Lista została zmieniona', { variant: 'success' })
      }).catch(() => {
          //enqueueSnackbar('blad updateu listy', { variant: 'error' })
      })
}
  const ChangeCheckbox = (index) => {
    props.myMap.get(props.myArray[index].parentID).values[index].boxstate=!props.myMap.get(props.myArray[index].parentID).values[index].boxstate
    setMyArray(Array.from(myArray))
    props.setMyMap(new Map([...props.myMap]))
    updateFirestore(index)
  }

  const ExpandLessInfo = (myID) => {
    props.myMap.get(myID).expanded=false
    props.setMyMap(new Map([...props.myMap]))
    console.log("Show less");

    updateFirestoreExpand(myID,false)
  }

  const ExpandMoreInfo = (myID) => {
    props.myMap.get(myID).expanded=true
    props.setMyMap(new Map([...props.myMap]))
    console.log("Show more");

    updateFirestoreExpand(myID,true)
  }
  const DeleteList = (e) => {
    props.listRef.delete()
    console.log("Delete List");
  }

  return (
    <Container key={props.id}>
      <Header>
        <span>{props.title}</span><DeleteIconContainer onClick={DeleteList}> </DeleteIconContainer>
        { props.myExpanded  === true &&
          <ExpandLessIconContainer onClick={()=>ExpandLessInfo(props.myID)}> 
          </ExpandLessIconContainer>
        }
        { props.myExpanded === false &&
          <ExpandMoreIconContainer onClick={()=>ExpandMoreInfo(props.myID)}>
          </ExpandMoreIconContainer>
        }
      </Header>
      
      <Collapse in={props.myExpanded} timeout={"auto"} style={{minWidth: '100%', margin: 0, padding: 0}}>
          <MoreContent>
            {props.myArray.map((element,index)=>
              <CheckBoxBtn onClick={()=>ChangeCheckbox(index)}>
              <Checkbox checked={element.boxstate} style={{color: '#323232'}}/>
              <CheckBoxText>{element.title}</CheckBoxText>
            </CheckBoxBtn>)}
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
