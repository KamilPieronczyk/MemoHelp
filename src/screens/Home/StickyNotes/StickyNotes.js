import React from 'react'
import styled from 'styled-components'
import {StickyNote} from './StickyNote'

export function StickyNotes(props) {
  return (
    <Container>
      <StickyNote title="Elo" content="Quibusdam qui exercitationem eum nihil. Sunt quisquam ut unde possimus est eveniet ex pariatur. Nemo enim possimus ut aut cumque quis consectetur enim. Laboriosam atque alias ullam quia voluptatem molestiae et ut in. Omnis reiciendis tempora. Dolore consequatur doloribus." />
      <StickyNote title="Elo" content="Lorem ipsum" />
      <StickyNote title="Elo" content="Lorem ipsum" />
      <StickyNote title="Elo" content="Lorem ipsum" />
      <StickyNote title="Elo" content="Lorem ipsum" />
    </Container>
  )
}

const Container = styled.div`
  grid-column: 1 / span 2;
  grid-row: 5 / span 2;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-self: stretch;
`