import React, { useState } from 'react'
import styled from 'styled-components'
import {ListCard} from './ListCard'
import {ListCreator} from './ListCreator'
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

export function ListContainer() {
  const [myArray, setMyArray] = useState(new Array());
  const [myArrayName, setMyArrayName] = useState(" ");
  const [myMap, setMyMap] = useState(new Map());
  //const [myArrayName, setMyArrayName] = useState(" ");

  


  const Add = () => {
    console.log("Click add");
  }

  const Delete = () => {
    console.log("Click remove");
  }

  return (
    <Container>
      <Header>
        <div>
          <AddIcon style={{marginRight: 10, cursor: 'pointer'}} onClick={Add} />
          <DeleteIcon style={{cursor: 'pointer'}} onClick={Delete} />
        </div>
      </Header>
      <List>
        <ListCreator setMyMap={setMyMap} myMap={myMap}>dupa123</ListCreator>
        {Array.from(myMap).map(([key,values]) => (<ListCard title={values.title} myArray={values.values}/>))}
      </List>
    </Container>
  )
}


const Container = styled.div`
  grid-Column: 3 / 4;
  grid-row: 1 / span 4;
  border: #73909C solid 2px;
  border-radius: 12px;
  box-sizing: border-box;
  position: relative;
`

const Header = styled.div`
  position: absolute;
  top: 0; right: 0;
  padding: 8px 15px 8px 15px;
  background-color: #73909C;
  border-radius: 0 9px 0 12px;
  box-sizing: border-box;
  color: #FFFAF5;
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