import React from 'react'
import styled from 'styled-components'
import MenuItem from '@material-ui/core/MenuItem';
import CheckIcon from '@material-ui/icons/Check'
import Btn from '../../../components/Button';
import firebase from 'firebase'
import {useSnackbar} from 'notistack'

export function InvitationCard(props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  let invitation = props.value;
  
  const removeInvitation = () => {
    let userId = "sQpA99mVpXQnvC0D1IcmNNhlPyr2"
    let groupId = invitation.id;

    firebase.firestore().collection("Users").doc(userId).collection("Groups").doc("Invitations").update({
      data: firebase.firestore.FieldValue.arrayRemove(groupId)
    }).catch(function(error) {
        enqueueSnackbar('Nie udało się zaakceptować zaproszenia', {variant: 'error'})
    });

    firebase.firestore().collection("Groups").doc(groupId).update({
      invitations: firebase.firestore.FieldValue.arrayRemove(userId),
    }).catch(function(error) {
        enqueueSnackbar('Nie udało się zaakceptować zaproszenia', {variant: 'error'})
    });
  }

  const handleAccept = () => {
    let userId = "sQpA99mVpXQnvC0D1IcmNNhlPyr2"
    let groupId = invitation.id;

    removeInvitation();

    firebase.firestore().collection("Groups").doc(groupId).update({
      members: firebase.firestore.FieldValue.arrayUnion(userId),
    }).catch(function(error) {
        enqueueSnackbar('Nie udało się zaakceptować zaproszenia', {variant: 'error'})
    });

    firebase.firestore().collection("Users").doc(userId).collection("Groups").doc("Members").update({
      data: firebase.firestore.FieldValue.arrayUnion(groupId)
    }).catch(function(error) {
        enqueueSnackbar('Nie udało się zaakceptować zaproszenia', {variant: 'error'})
    });

    enqueueSnackbar('Zaproszenie zotało zaakceptowane', { variant: 'success' })
  }

  const handleRemove = () => {
    removeInvitation();
    enqueueSnackbar('Zaproszenie zotało usunięte', { variant: 'w' })
    return;
  }

  return (
    <Container>
      {props.message}
      <Info>
        <span style={{marginLeft: 7 + 'px'}}>{invitation.msg}</span>
        <ButtonsDiv>
          <Btn text="Akceptuj" onClick={handleAccept}/>
          <Btn text="Usuń" onClick={handleRemove}/>
        </ButtonsDiv>
      </Info>
    </Container>
  );
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

const Info = styled.div`
  padding-top: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`

const ButtonsDiv = styled.div`
  padding-top: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
`
