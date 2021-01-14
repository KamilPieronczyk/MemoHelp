import React, { useState } from 'react'
import styled from 'styled-components'
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';
import Checkbox from '@material-ui/core/Checkbox';
import { Collapse } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { useUser } from '../../../utils';
import firebase from 'firebase';
import {useSnackbar} from 'notistack'
import { MemorySharp, TextsmsSharp } from '@material-ui/icons';

function ListCardBtn(props) {
  const [state, setState] = useState(false);
  const ChangeCheckbox = (e) => {
    console.log("Change checkbox 1");
    let b = state
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

export function ListCreator(props) {
    
    const [productID, setProductID] = useState(0);
    const [myArray, setMyArray] = useState(new Array());
    const [textContent, handleTextChange] = useState('');
    const [listContent, handleListChange] = useState('');

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const {user}=useUser();
    const [state, setState] = useState(false);
    const ChangeCheckbox = (e) => {
        console.log("Change checkbox 1");
        let b = state;
        setState(!b);
      }
    const pushToFirestore = () => {
        if (!validateTextInput()) return
        if (!validateTextTitle()) return
        firebase
            .firestore()
            .collection('Users')
            .doc(user.uid)
            .collection('Lists')
            .add({
                 title: textContent,
                 expanded: false,
                 myList: [...myArray]

            }).then(() => {
            enqueueSnackbar('Lista została dodana', { variant: 'success' })
            clearForm()
            clearList()
            setMyArray(new Array())
        }).catch(() => {
            enqueueSnackbar('Wystąpił problem z dodaniem listy', { variant: 'error' })
        })
    }
    const validateTextInput = () => {
        if (myArray.length == 0) {
            enqueueSnackbar('Zawartość Listy nie może być pusta', { variant: 'error' })
            return false
        }
        return true
    }
    const validateTextTitle = () => {
      if (textContent == "") {
          enqueueSnackbar('Tytuł Listy nie może być pusty', { variant: 'error' })
          return false
      }
      return true
  }
    const clearForm = () => {
        handleTextChange("")
    }
    const clearList = () => {
        handleListChange("")
    }
    const addToArray=(event) =>{
        if(event.key!='Enter')
        return
        var title = listContent
        console.log(title)
        myArray.push({id: productID, title: title, boxstate: false, parentID: 0})
        setProductID(productID+1)
        console.log(myArray)
        setMyArray(Array.from(myArray))
        clearList()
    }

  return (
    <Container key={props.id}>

          <MoreContent>
  // TODO please refactor this piece of code
            <MyTextInput value={textContent} placeholder="Dodaj tytuł"  color='#9C9083'onChange={e => { handleTextChange(e.target.value); }}></MyTextInput>
            {myArray.map((index)=>
              <CheckBoxBtn onClick={ChangeCheckbox}>
              <Checkbox checked={index.boxstate.checked} style={{color: '#323232'}}/>
              <CheckBoxText>{index.title}</CheckBoxText>
            </CheckBoxBtn>)}
            <MoreIconContainerTop>
                <CheckIcon onClick={pushToFirestore}/>
            </MoreIconContainerTop>
            <CheckBoxBtn onClick={ChangeCheckbox}>
                <Checkbox style={{color: '#323232'}}/>
  // TODO please refactor this piece of code
                <MyTextField value={listContent} placeholder="Dodaj notatke" color="#FFFAF5"  onChange={e => { handleListChange(e.target.value); }} onKeyDown={addToArray}/> 
            </CheckBoxBtn>
          </MoreContent>
    </Container>
  )
}

const MyTextInput = styled.textarea`
height: 100%;
width: 100%;
text-decoration:none;
border: none;
background:none;
outline:none;
color:#9C9083;
resize: vertical;
font-size:16px;
`;
const MyTextField = styled.input`
  height: 90%;
  width: 95%;
  text-decoration:none;
  border: none;
  background:none;
  outline:none;
  justify-content: flex-start;
  border-radius: 12px;
  background-color: #9C9083;
  color: #FFFAF5;
  cursor: pointer;
`;
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
const MoreIconContainerTop = withStyles((theme) => ({
    root: {
        position: 'absolute',
        top: 10,
        right: 15,
        color: 'rgba(0,0,0,.83)'
    }
}))(IconButton);

const MoreIconContainerBottom = withStyles((theme) => ({
    root: {
        position: 'absolute',
        right: 15,
        color: 'rgba(0,0,0,.83)'
    }
}))(IconButton);