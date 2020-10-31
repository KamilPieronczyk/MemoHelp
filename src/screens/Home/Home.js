import React from 'react'
import styled from 'styled-components'

import {NotificationsList} from './NotificationsList/NotificationsList'
import {StickyNote} from './StickyNote'

export default function Home() {
  return (
    <Container>
      <WidgetContainer>
        <NotificationsList />
        <StickyNote index={1}/>
        <StickyNote index={2}/>
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
