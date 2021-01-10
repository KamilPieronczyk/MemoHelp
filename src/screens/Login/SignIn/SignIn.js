import styled from 'styled-components'
import React, { useState } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import validator from 'validator';
import firebase from 'firebase';
import history from '../../../history';
import {
    Link
  } from "react-router-dom";
import {Button} from '../../../components'
import {useSnackbar} from 'notistack'

export function LoginForm() {
    const [state, setState] = useState(false);
    const handleChange = (event) => {
        setState(!state);
    };
    const [mail, setMail] = useState("");
    const [password, setPassword]=useState("");
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const validateForm = () => {
        if(!validator.isEmail(mail)){
            return false;
        }
        if (!validator.isLength(password,{min:6, max:30})){
            return false;
        }
        return true;
    };
    const login = () => {
        setButtonDisabled(true);
        if (!validateForm())
        {
            enqueueSnackbar('Błędne dane logowania', {variant: 'error'});
            console.log("Błąd walidacji");
            setButtonDisabled(false);
            return false;
        }
        if (!state){
            firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(()=>{
                firebase.auth().signInWithEmailAndPassword(mail, password).then(()=>{
                    console.log("zalogowano");
                    setButtonDisabled(false);
                }).catch(function(error) {
                    // Handle Errors here.
                    //var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log("firebase auth:",errorMessage);
                    enqueueSnackbar('Błędne dane logowania', {variant: 'error'});
                    setButtonDisabled(false);
                    // ...
                  });
            });
        }
        else{
            firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(()=>{
                firebase.auth().signInWithEmailAndPassword(mail, password).then(()=>{
                    console.log("zalogowano");
                    setButtonDisabled(false);
                }).catch(function(error) {
                    // Handle Errors here.
                    //var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log("firebase auth:",errorMessage);
                    enqueueSnackbar('Błędne dane logowania', {variant: 'error'});
                    setButtonDisabled(false);
                    // ...
                  });
            });
        }
    }
    var provider = new firebase.auth.GoogleAuthProvider();
    const gLogin = () => {
        setButtonDisabled(true);
        provider.setCustomParameters({
            'login_hint': 'user@example.com'
          });
          firebase.auth().signInWithPopup(provider).then(function(result) {
            var credential = result.credential;

            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // ...
            console.log("zalogowano gmail (chyba)");

            var user = firebase.auth().currentUser;
            var email = user.email;
            var userName = user.displayName;

            firebase.firestore().collection('Users').doc(user.uid).set({
                email: email,
                userName: userName
            }).then(function(){
                setButtonDisabled(false);
            });
          }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            enqueueSnackbar('Wystąpił błąd', {variant: 'error'});
            setButtonDisabled(false);
            // ...
          });
    }

    const GoogleIcon = () => <img src="https://img.icons8.com/fluent/48/000000/google-logo.png"/>;
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
                    text={<span style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>Zaloguj się {GoogleIcon()}</span>}
                    onClick={gLogin}
                    disabled={buttonDisabled}
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
                    disabled={buttonDisabled}
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
const Google = styled.div`
    height: 48px;
    flex-direction:row;
    display:flex;
    background-color: #FFFFFF;
    text-align: center;
    font-size: 16px;
    border-radius: 12px;
    color: black;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    align-content: center;
    align-items: center;
    padding-left:20px;
    padding-right:40px;
`
const Buttonscontainer = styled(EmptyBox)`
    flex-direction:row;
    justify-content: space-evenly;
    flex-grow: 0;
`

const ImgG = styled.img`
    object-fit: scale-down;
    height:34px;
    width:34px;
`
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
`
const MyLink2 = styled(Link)`
text-decoration: none;
color:#738F9C; 
display: flex;
flex-direction: row;
&:hover{color: #9C9083};
font-weight: medium;
font-size: 14px;
justify-content:flex-end;
margin-right:12px;
`