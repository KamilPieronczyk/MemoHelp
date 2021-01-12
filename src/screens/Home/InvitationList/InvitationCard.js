import React from 'react'
import styled from 'styled-components'
import Btn from '../../../components/Button';
import firebase from 'firebase'
import {useSnackbar} from 'notistack'

export function InvitationCard(props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  let invitation = props.value;
  
  async function removeInvitation() {
    let userId = await firebase.auth().currentUser.uid
    let groupId = invitation.id;

    try {
      firebase.firestore().collection("Users").doc(userId).collection("GroupsInvitations").doc(groupId).delete();
      firebase.firestore().collection("Groups").doc(groupId).update({
        invitations: firebase.firestore.FieldValue.arrayRemove(userId),
      })
    } catch (error) {
      throw error;
    }

  }

  async function handleAccept() {
    let userId = await firebase.auth().currentUser.uid
    let groupId = invitation.id;

    try{
      await removeInvitation();
      firebase.firestore().collection("Groups").doc(groupId).update({
        members: firebase.firestore.FieldValue.arrayUnion(userId),
      })
      firebase.firestore().collection("Users").doc(userId).collection("Groups").doc("Members").update({
        data: firebase.firestore.FieldValue.arrayUnion(groupId)
      })
      enqueueSnackbar('Zaproszenie zotało zaakceptowane', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar(`Nie udało się zaakceptować zaproszenia: ${error}`, {variant: 'error'})
    }
  }

  async function handleRemove() {
    try{
      await removeInvitation();
      enqueueSnackbar('Zaproszenie zotało usunięte', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(`Nie udało się usunąć zaproszenia: ${error}`, {variant: 'error'})
    }
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
