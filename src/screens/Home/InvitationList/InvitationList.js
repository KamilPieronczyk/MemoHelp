import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {InvitationCard} from './InvitationCard'
import firebase from 'firebase'

export function InvitationList() {
  const [invitationList, setList] = useState(new Array());

  useEffect(async () => {
    if(firebase.auth().currentUser !== null) {
      const invitations = firebase.firestore().collection('Users').doc(firebase.auth().currentUser.uid).collection("GroupsInvitations");
      const invitationsSubscription = invitations.onSnapshot(snapshot => {
        renderList(snapshot)
      })
      return () => {
        invitationsSubscription()
      }
    }
  }, [])

  const renderList = (snapshot) => {
    let array = new Array()
    snapshot.docs.map(doc => {
      let data = {
        id: doc.id,
        msg: doc.data().msg
      }
      array.push(
        <InvitationCard value={data}/>
      )
    })
    console.log(array)
    setList(array)
  }

  return (
    <Container>
      <Header>
        <HeaderText>AKTYWNE ZAPROSZENIA</HeaderText>
      </Header>
      <List>
        {invitationList}
      </List>
    </Container>
  )
}


const Container = styled.div`
  //grid-area: span 1;
  //grid-row: span 4;
  min-height: 400px;
  border: #73909C solid 2px;
  border-radius: 12px;
  box-sizing: border-box;
  position: relative;
`

const Header = styled.div`
  position: absolute;
  top: 0; right: 0;
  padding: 10px 25px 12px 25px;
  background-color: #73909C;
  border-radius: 0 9px 0 12px;
  box-sizing: border-box;
`

const HeaderText = styled.p`
  color: rgba(255,255,255,.83);
  padding: 0;
  margin: 0;
  font-weight: 500;
  font-size: 16;
`

const List = styled.div`
  position: absolute;
  top: 45px; left: 0; right: 0; bottom: 0;
  padding: 0px 15px 0 15px;
  display: flex;
  flex-direction: column;
  align-content: stretch;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 0px #9C9083;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #9C9083;
    border-radius: 5px;
  }
`