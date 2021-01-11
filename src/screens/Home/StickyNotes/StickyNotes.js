import React,{useState,useEffect} from 'react';
import styled from 'styled-components'
import {StickyNote} from './StickyNote'
import {StickyNoteCreator} from './StickyNoteCreator'
import { useUser } from '../../../utils';

import firebase from 'firebase'

export function StickyNotes(props) {
  const [list, setList] = useState(new Array())
  const {user}=useUser();

  useEffect(() => {
    const stickyNote = firebase.firestore().collection('Users').doc(user.uid).collection('StickyNotes')
    const query = stickyNote.limit(5)
    const stickyNoteSubscription = query.onSnapshot(snapshot => {
      renderList(snapshot)
    })
    return () => {
      stickyNoteSubscription()
    }
  }, [])

  const renderList = (snapshot) => {
    let array = new Array()
    snapshot.forEach(stickyNote => {
      let data = {
          text: stickyNote.data().text,
          ref: stickyNote.ref

      }
      console.log(data);
      console.log(data.ref);
      array.push(
        <StickyNote content={data.text} stickyRef={data.ref}/>
      )
    })
    console.log(array)
    setList(array)
  }
  return (
    <React.Fragment>
      <StickyNoteCreator title="stworz notatke" />
      {list}
    </React.Fragment>
  )
}