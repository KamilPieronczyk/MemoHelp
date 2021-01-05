import React,{useState} from 'react';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MoreIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import firebase from 'firebase';
import {useSnackbar} from 'notistack'

export function StickyNoteCreator(props) {
    const [textContent, handleTextChange] = useState('');
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const pushToFirestore = () => {
        if (!validateTextInput()) return
        firebase
            .firestore()
            .collection('Users')
            .doc('sQpA99mVpXQnvC0D1IcmNNhlPyr2')
            .collection('StickyNotes')
            .add({
                text: textContent
            }).then(() => {
            enqueueSnackbar('Notatka została dodana', { variant: 'success' })
            clearForm()
        }).catch(() => {
            enqueueSnackbar('Wystąpił problem z dodaniem notatki', { variant: 'error' })
        })
    }
    const validateTextInput = () => {
        if (textContent == "") {
            enqueueSnackbar('Treść przypomnienia nie może być pusta', { variant: 'error' })
            return false
        }
        return true
    }
    const clearForm = () => {
        handleTextChange("")
    }
    return (
        <Container>
            <MyTextInput value={textContent} placeholder="Dodaj notatke" color='#9C9083' onChange={e => { handleTextChange(e.target.value); }}></MyTextInput>
            <MoreIconContainer>
                <AddIcon onClick={pushToFirestore} />
            </MoreIconContainer>
        </Container>
    );
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

const Container = styled.div`
	width: calc(100% / 2 - 10px);
	background-color: #fffaf5;
	border-radius: 12px;
	box-sizing: border-box;
	position: relative;
	padding: 25px;
	font-size: 14px;
	color: rgba(0, 0, 0, .83);
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  margin-top: 10px;
  margin-right: 15px;
`;
const MoreIconContainer = withStyles((theme) => ({
    root: {
        position: 'absolute',
        top: 0,
        right: 0,
        color: 'rgba(0,0,0,.83)'
    }
}))(IconButton);
