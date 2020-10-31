import React from 'react'
import styled from 'styled-components'

import {NotificationsList} from './NotificationsList/NotificationsList'

export default function Home() {
  return (
    <Container>
      <WidgetContainer>
        <NotificationsList />
      </WidgetContainer>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 100px);
  position: relative;
`

const WidgetContainer = styled.div`
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 4fr 3fr;
`
