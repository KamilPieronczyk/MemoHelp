//import { Container } from '@material-ui/core'
//import React from 'react'
import styled from 'styled-components'
//import Checkbox from '@material-ui/core/Checkbox';
import React, { useState } from 'react';
//import { withStyles } from '@material-ui/core/styles';
//import { green } from '@material-ui/core/colors';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import validator from 'validator';
import firebase from 'firebase';
import history from '../../../history';
import {
    //BrowserRouter as Router,
    //Switch,
    //Route,
    Link
  } from "react-router-dom";
import {Button} from '../../../components'

// const GreenCheckbox = withStyles({
//     root: {
//         color: green[400],
//         '&$checked': {
//             color: green[600],
//         },
//     },
//     checked: {},
// })((props) => <Checkbox color="default" {...props} />);

export function LoginForm() {
    const [state, setState] = useState({
        checkedA: true,
        checkedB: true,
        checkedF: true,
        checkedG: true,
    });
    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };
    const [mail, setMail] = useState("");
    const [password, setPassword]=useState("");
    const validateForm = () => {
        if(!validator.isEmail(mail))
            return false;
        if (!validator.isLength(password,{min:6, max:30}))
            return false;
        return true;
    };
    const login = () => {
        if (!validateForm())
        {
            console.log("Błąd walidacji");
            return false;
        }
        firebase.auth().signInWithEmailAndPassword(mail, password).then(()=>{
            history.push("/");
            window.location.reload();
            console.log("zalogowano");
        }).catch(function(error) {
            // Handle Errors here.
            //var errorCode = error.code;
            var errorMessage = error.message;
            console.log("firebase auth:",errorMessage);
            // ...
          });
        
    }
    var provider = new firebase.auth.GoogleAuthProvider();
    const gLogin = () => {
        provider.setCustomParameters({
            'login_hint': 'user@example.com'
          });
          firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // ...
            history.push("/");
            window.location.reload();
            console.log("zalogowano gmail (chyba)");
          }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
          });
    }
    return (
        <LoginContainer>
            <MyInput type="email" id="fname" name="fname" placeholder="e-mail" onChange={e=>setMail(e.target.value)}>
            </MyInput>
            <MyInput type="password" id="pname" name="pname" placeholder="hasło" onChange={p=>setPassword(p.target.value)}>
            </MyInput>
            <MyLink2 to="/login/recover">Odzyskiwanie hasła</MyLink2>
            <EmptyBox>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={state.checkedB}
                            onChange={handleChange}
                            name="checkedB"
                            color="#73909C"
                        />
                    }
                    label="Pamiętaj mnie"
                />
            </EmptyBox>
            <Buttonscontainer>
                {/* <Google>
                    <ImgG src="/assets/1004px-Google__G__Logo.svg.webp"></ImgG>
                    <span style={{ paddingTop: 16, paddingBottom: 16, paddingLeft: 20 }}>Zaloguj się</span>
                </Google> */}
                <Button
					type="contained"
					style={{
						width: '48%',
						color: 'black',
					}}
                    text="Zaloguj się g"
                    onClick={gLogin}
				/>
                <Button
					color="#73909C"
					type="contained"
					style={{
						width: '48%',
						color: '#fff',
					}}
                    text="Zaloguj się"
                    onClick={login}
				/>
            </Buttonscontainer>
           
            <MyLink to="/login/reg">Jeśli nie masz konta, stwórz je</MyLink>
                       
        </LoginContainer>
    )
}

const LoginContainer = styled.div`
    //min-height: 300px;
    min-width: 417px;
    //background-color: #dfdfdf;
    flex-direction: column;
    display: flex;
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
    //min-height:50px;
    //min-width:417px;
    margin: 10px;
    display: flex;
    flex-direction: row;
    //text-align:center;
    color: #73909C;
`
// const Zaloguj = styled.div`
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
//     //width:100%;
// `
const Google = styled.div`
    //width: 200px;
    height: 48px;
    //border: 2px solid #FFFFFF;
    flex-direction:row;
    display:flex;
    background-color: #FFFFFF;
    //color: #FFFFFF;
    text-align: center;
    font-size: 16px;
    border-radius: 12px;
    color: black;
    //padding: 16px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    align-content: center;
    align-items: center;
    //width:100%;
    padding-left:20px;
    padding-right:40px;
`
const Buttonscontainer = styled(EmptyBox)`
    flex-direction:row;
    //display:flex;
    //margin: 10px;
    justify-content: space-evenly;
    flex-grow: 0;
`

const ImgG = styled.img`
    object-fit: scale-down;
    height:34px;
    width:34px;
`
// const EmptyBox2 = styled.div`
//     //min-height:50px;
//     //min-width:417px;
//     margin: 10px;
//     flex-direction: row;
//     text-align:center;
//     font-weight: bold;
//     font-size: 14px;
//     align-content:center;
//     align-items:center;
// `
const MyLink = styled(Link)`
color: ${props=>props.active?"#738F9C":"black"} ;
text-decoration: none; 
display: flex;
flex-direction: row;
align-content: center;
//padding-left: 15px;
&:hover{color: #9C9083};
font-weight: bold;
font-size: 14px;
text-align:center;
align-items: center;
margin: 10px;
justify-content:center;
//width:100%;
`
const MyLink2 = styled(Link)`
text-decoration: none;
color:#738F9C; 
display: flex;
flex-direction: row;
//align-content: center;
//padding-left: 15px;
&:hover{color: #9C9083};
font-weight: medium;
font-size: 14px;
//text-align:center;
//align-items: center;
//margin: 10px;
justify-content:flex-end;
//width:100%;
margin-right:12px;
`