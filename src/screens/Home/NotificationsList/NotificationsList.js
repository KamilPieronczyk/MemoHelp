import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {NotificationCard} from './NotificationCard'
import firebase from 'firebase'
import {useUser, getAllGroups} from '../../../utils'

export function NotificationsList() {
  const [list, setList] = useState(new Array())
  const {user} = useUser()
  ///const [groups, setGroups];

  useEffect(async () =>  {
    const reminders = firebase.firestore().collection('Users').doc(user.uid).collection('Reminders')
    const query = reminders.limit(7).orderBy('date', 'asc')
    // await setGroups( getAllGroups());
    // console.log(groups);
    const remindersSubscription = query.onSnapshot(snapshot => {
      renderList(snapshot)
    })
    return () => {
      remindersSubscription()
    }
  }, [])

  const renderList = (snapshot) => {
    let array = new Array()
    snapshot.forEach(reminder => {
      let data = {
        id: reminder.id,
          text: reminder.data().text,
          date: new Date(reminder.data().date.seconds * 1000),
          frequency: reminder.data().frequency,
          weekDays: reminder.data().weekDays,
          type: reminder.data().type,
          ref: reminder.ref
      }
      array.push(
        <NotificationCard message={data.text} time={data.date} id={data.id} value={data}/>
      )
    })
    console.log(array)
    setList(array)
  }

  return (
    <Container>
      <Header>
        <HeaderText>NAJBLIŻSZE POWIADOMIENIA</HeaderText>
      </Header>
      <List>
        {list}
      </List>
    </Container>
  )
}


const Container = styled.div`
  //grid-area: 1 / span 1;
  //grid-row: span 4;
  min-height: 400px;
  border: #73909C solid 2px;
  border-radius: 12px;
  box-sizing: border-box;
  position: relative;
`

const Header = styled.div`
  position: absolute;
  top: 0; left: 0;
  padding: 10px 25px 12px 25px;
  background-color: #73909C;
  border-radius: 9px 0 12px 0;
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