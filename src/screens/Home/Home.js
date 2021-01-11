import React from 'react'
import styled from 'styled-components'
import {NotificationsList} from './NotificationsList/NotificationsList'
import {InvitationList} from './InvitationList/InvitationList'
import {ListContainer} from './List/List'
import {StickyNotes} from './StickyNotes/StickyNotes'
import {NewNotificationForm} from './NewNotificationForm/NewNotificationForm'
import {atom} from 'recoil'
export default function Home() {
  return (
    <Container>
      <WidgetContainer>
        <NotificationsList />
        <NewNotificationForm />
        <ListContainer />
        <InvitationList />
      </WidgetContainer>
      <StickyNotes />
    </Container>
  )
}

export const isFormOpened = atom({
  key: 'ReminderFormOpenState',
  default: false
})

const Container = styled.div`
  width: 100%;
  min-height: 100%;
  position: relative;
`

const WidgetContainer = styled.div`
  height: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  grid-gap: 15px;
`

