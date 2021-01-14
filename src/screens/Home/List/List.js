import React,{useState,useEffect} from 'react';
import styled from 'styled-components'
import {ListCard} from './ListCard'
import {ListCreator} from './ListCreator'
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import {isFormOpened} from '../Home'
import {useRecoilValue} from 'recoil'
import firebase from 'firebase'
import { useUser } from '../../../utils';



export function ListContainer(props) {
  const [list, setList] = useState(new Array())
  const [tableID, setTableID] = useState(0);
  const [myArray, setMyArray] = useState(new Array());
  const [myArrayName, setMyArrayName] = useState(" ");
  const [myMap, setMyMap] = useState(new Map());
  const {user}=useUser();

  //const [myArrayName, setMyArrayName] = useState(" ");
  useEffect(() => {
    const List = firebase.firestore().collection('Users').doc(user.uid).collection('Lists')
    const query = List
    const stickyNoteSubscription = query.onSnapshot(snapshot => {
      myMap.clear()
      setMyMap(myMap)
      if(!snapshot.empty)
        renderList(snapshot)
    })
    return () => {
      stickyNoteSubscription()
    }
  }, [])
  
  const renderList = (snapshot) => {
  
    snapshot.forEach(element => {
      let data = {
          text: element.data().title,
          myList: element.data().myList,
          myExpanded: element.data().expanded,
          ref: element.ref

      }
      Array.from(data.myList).forEach(tempElement =>{
        tempElement.parentID=element.id
      })
      // TODO please refactor this piece of code
      myMap.set(element.id, {title: data.text, ref: data.ref, elementID:element.id, myExpanded: data.myExpanded, values: Array.from(data.myList)})
      setMyMap(new Map([...myMap]))
    })
  }

  const isReminderFormOpened = useRecoilValue(isFormOpened)
  const Add = () => {
    console.log("Click add");
  }

  const Delete = (props) => {
    console.log("Click remove");
  }

  if(isReminderFormOpened) return null

  return (
    <Container>
      <Header>
        <div>
          <AddIcon style={{marginRight: 10, cursor: 'pointer'}} onClick={Add} />
          <DeleteIcon style={{cursor: 'pointer'}} onClick={Delete} />
        </div>
      </Header>
      <List>
        <ListCreator >dupa123</ListCreator>
        // TODO please refactor this piece of code
        {Array.from(myMap).map(([key,values]) => (<ListCard title={values.title} myArray={values.values} listRef={values.ref} myMap={myMap} myExpanded={values.myExpanded} myID={values.elementID} setMyMap={setMyMap}/>))}
      </List>
    </Container>
  )
}


const Container = styled.div`
  //grid-Column: 3 / 4;
  min-height: 400px;
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