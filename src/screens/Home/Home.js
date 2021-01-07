import React from 'react'
import styled from 'styled-components'

import {NotificationsList} from './NotificationsList/NotificationsList'
import {InvitationList} from './InvitationList/InvitationList'
import {ListContainer} from './List/List'
import {StickyNotes} from './StickyNotes/StickyNotes'
import {NewNotificationForm} from './NewNotificationForm/NewNotificationForm'
import {IsAuthorized} from '../../utils';
import {IsLoggedIn} from '../../utils';

export default function Home() {
  IsAuthorized();
  if(IsLoggedIn())
  return (
    <Container>
      <WidgetContainer>
        <NotificationsList />
        <StickyNotes />
        <NewNotificationForm />
        <ListContainer />
        <InvitationList />
        <div style={{gridArea: '4 / 5', gridRow: '1 / span 4'}}></div>
      </WidgetContainer>
    </Container>
  )
  else
  return (
    <div/>
  )
}

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 200px);
  position: relative;
`

const WidgetContainer = styled.div`
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: repeat(6, 1fr);
  grid-gap: 15px;
`
