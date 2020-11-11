import React from 'react'
import styled from 'styled-components'

import {NotificationsList} from './NotificationsList/NotificationsList'
import {ListContainer} from './List/List'
import {StickyNotes} from './StickyNotes/StickyNotes'
import {NewNotificationForm} from './NewNotificationForm/NewNotificationForm'
import {IsAuthorized} from '../../utils';

export default function Home() {
  IsAuthorized();
  return (
    <Container>
      <WidgetContainer>
        <NotificationsList />
        <StickyNotes />
        <NewNotificationForm />
        <ListContainer />
      </WidgetContainer>
    </Container>
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
