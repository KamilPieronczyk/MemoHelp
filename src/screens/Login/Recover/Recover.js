//import { Container } from '@material-ui/core'
//import React from 'react'
import styled from 'styled-components'
//import Checkbox from '@material-ui/core/Checkbox';
import React, { useState } from 'react';
// import { withStyles } from '@material-ui/core/styles';
// import { green } from '@material-ui/core/colors';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import {
    // BrowserRouter as Router,
    // Switch,
    // Route,
    Link
  } from "react-router-dom";
import {Button} from '../../../components';
import firebase from 'firebase';



export function Recover() {
    const [state, setState] = useState(false);
    const [mail, setMail] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [state2, setState2] = useState(false);
    
    const sendMail = () =>{
        setState2(false);
        setButtonDisabled(true);
        var auth = firebase.auth();
        var emailAddress = mail;

        auth.sendPasswordResetEmail(emailAddress).then(function(){
            //sent
            setButtonDisabled(false);
        }).catch(function(error){
            //error
            setState2(true);
            setButtonDisabled(false);
        });
    }
    
    if(state&&(!state2))
    {
        return (
            <LoginContainer>
                <Nag>
                <EmptyBox></EmptyBox><MyLink to="/login">Powrót</MyLink>
                </Nag>
                <EmptyBox>
                    Wiadomość z linkiem przekierowującym została wysłana.
                </EmptyBox>
                <Buttonscontainer>
                <Button
                        color="#73909C"
                        type="contained"
                        style={{
                            width: '75%',
                            color: '#fff',
                        }}
                        text="Wyślij wiadomość ponownie"
                        onClick={()=>{sendMail(); setState(true);}}
                        disabled={buttonDisabled}
                    />
                </Buttonscontainer>
            </LoginContainer>
        )
    }
    if(state2)
    {
        return (
            <LoginContainer>
                <Nag>
                <MyText>Odzyskiwanie hasła:</MyText>
                <MyLink to="/login">Powrót</MyLink>
                </Nag>
                <MyInput type="email" id="fname" name="fname" placeholder="e-mail" onChange={e=>setMail(e.target.value)}>
                </MyInput>
                <WrongMail>
                    Niepoprawny adres e-mail
                </WrongMail>
                
                <Buttonscontainer>
                <Button
                        color="#73909C"
                        type="contained"
                        style={{
                            width: '60%',
                            color: '#fff',
                        }}
                        text="Wyślij wiadomość"
                        onClick={()=>{sendMail(); setState(true);}}
                        disabled={buttonDisabled}
                    />
                </Buttonscontainer>
            </LoginContainer>
        );
    }
    return (
        <LoginContainer>
            <Nag>
            <MyText>Odzyskiwanie hasła:</MyText>
            <MyLink to="/login">Powrót</MyLink>
            </Nag>
            <MyInput type="email" id="fname" name="fname" placeholder="e-mail" onChange={e=>setMail(e.target.value)}>
            </MyInput>
            <WrongMail>
                
            </WrongMail>
            
            <Buttonscontainer>
            <Button
                    color="#73909C"
                    type="contained"
                    style={{
                        width: '60%',
                        color: '#fff',
                    }}
                    text="Wyślij wiadomość"
                    onClick={()=>{sendMail(); setState(true);}}
                    disabled={buttonDisabled}
                />
            </Buttonscontainer>
        </LoginContainer>
    );
}


const LoginContainer = styled.div`
    //min-height: 300px;
    min-width: 417px;
    //background-color: #dfdfdf;
    flex-direction: column;
    display: flex;
    color: #73909C;
    font-size: 16px;
`
const MyInput = styled.input`
    border: 2px solid #73909C;
    //min-height:50px;
    margin: 10px;
    font-family: 'Roboto', sans-serif;
    color: #73909C;
    font-size: 16px;
    border-radius: 10px;
    padding: 16px;
    background-color: transparent;
    &:focus {
        border-radius: 10px;
        border-color: #73909C;
        outline: none;
    }
    &:active {
        border-radius: 10px;
        border-color: #73909C;
        outline: none;
    }
`
const EmptyBox = styled.div`
    display: flex;
    flex-direction: row;
    //text-align:center;
    color: #73909C;
    font-weight: medium;
    margin-top:10px;
    margin-bottom:10px;
`
// const Zarejestruj = styled.div`
//     //width: 200px;
//     //height: 50px;
//     //border: 2px solid #73909C;
//     background-color: #73909C;
//     color: #FFFFFF;
//     text-align: center;
//     font-size: 16px;
//     border-radius: 10px;
//     padding: 16px;
//     box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
//     padding-right:40px;
//     padding-left:40px;
//     //width:100%;
// `

const Buttonscontainer = styled(EmptyBox)`
    flex-direction:row;
    //display:flex;
    //margin: 10px;
    justify-content: space-evenly;
`


// const EmptyBox2 = styled.div`
//     //min-height:50px;
//     min-width:417px;
//     margin: 10px;
//     flex-direction: row;
//     text-align:center;
//     font-weight: bold;
//     font-size: 14px;
// `
const MyText=styled.div`
    margin: 10px;
    font-family: 'Roboto', sans-serif;
    color: #73909C;
    font-size: 16px;
`
const Nag=styled.div`
flex-direction: row;
display: flex;
justify-content: space-between;
`
const MyLink = styled(Link)`
text-decoration: none;
color:#738F9C; 
display: flex;
flex-direction: row;
align-content: center;
//padding-left: 15px;
&:hover{color: #9C9083};
font-weight: medium;
font-size: 14px;
text-align:center;
align-items: center;
margin: 10px;
justify-content:center;
//width:100%;
margin-right:12px;
`
const WrongMail=styled.div`
color:red;
font-size:14px;
margin-left:12px;
min-height:20px;
`