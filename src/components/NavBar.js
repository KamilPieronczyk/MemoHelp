import React,{useState} from 'react'
import styled from 'styled-components'
import HomeIcon from '@material-ui/icons/Home';
import CalendarToday from '@material-ui/icons/CalendarToday';
import PeopleAlt from '@material-ui/icons/PeopleAlt';
import Person from '@material-ui/icons/Person';
import ExitToApp from '@material-ui/icons/ExitToApp';
import {IsAuthorized} from '../utils/index';
import {IsLoggedIn} from '../utils/index';
import firebase from 'firebase';


import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

const logOut = () =>{
  firebase.auth().signOut().then(()=>{
    //success
  }).catch((error)=>{
    //error
  });
  //history.push("/");
  //window.location.reload();
  console.log("wylogowano (chyba)");
}

export default function NavBar() {
  IsAuthorized();
  const [URL,setURL]=useState(window.location.pathname);
  let OnClick=(newURL)=>{setURL(newURL)}
  if(window.location.pathname!="/Login"&&IsLoggedIn())
  return (
    <Container>
      <MyLink to="/"          active={URL == ""?true:false}         onClick={()=>OnClick("")}>          <HomeIcon style={{paddingRight: 5}}     />Home </MyLink>
      <MyLink to="/Calendar"  active={URL == "/Calendar"?true:false}onClick={()=>OnClick("/Calendar")}> <CalendarToday style={{paddingRight: 5}}/>Kalendarz</MyLink> 
      <MyLink to="/Groups"    active={URL == "/Groups"?true:false}  onClick={()=>OnClick("/Groups")}>   <PeopleAlt style={{paddingRight: 5}}    />Zarządzaj grupami </MyLink>
      <MyLink to="/settings"  active={URL == "/settings"?true:false} onClick={()=>OnClick("/settings")}>  <Person style={{paddingRight: 5}}       />Jan Kowalski </MyLink>
      <MyLink to="/Login"     onClick={logOut}>   <ExitToApp style={{paddingRight: 5}}    />Wyloguj</MyLink>    
    </Container>
  )
  else
  return(
    <Container>  
    </Container>
  )
}

const MyLink = styled(Link)`
color: ${props=>props.active?"#738F9C":"black"} ;
text-decoration: none;
display: flex;
flex-direction: row;
align-content: center;
padding-left: 15px;
&:hover{color: #9C9083};
`
const Container = styled.div`
  width: 100%;
  padding: 30px 0 30px 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-self: center;
`


