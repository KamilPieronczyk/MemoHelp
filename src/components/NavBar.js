import React from 'react'
import styled from 'styled-components'

export default function NavBar() {
  return (
    <Container>
      <span>Item</span>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  padding: 30px 0 30px 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-self: center;
`
