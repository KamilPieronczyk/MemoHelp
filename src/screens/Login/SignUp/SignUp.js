import styled from 'styled-components'
import React, { useState } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import validator from 'validator';
import firebase from 'firebase';
import {
    Link
  } from "react-router-dom";
import {Button} from '../../../components';
import {useSnackbar} from 'notistack'

export function Register(props) {
    const [mail, setMail] = useState("");
    const [password, setPassword]=useState("");
    const [password2,setPassword2]=useState("");
    const [name, setName]=useState("");
    const [state, setState] = useState(false);
    const handleChange = (event) => {
        setState(!state);
    };
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const validateForm = () => {
        if(!validator.isEmail(mail)){
            enqueueSnackbar('Błędny adres email', {variant: 'error'});
            return false;
        }
        if(password!==password2){
            enqueueSnackbar('Hasła różnią się', {variant: 'error'});
            return false;
        }
        if (!validator.isLength(password,{min:6, max:30})){
            enqueueSnackbar('Hasło musi zawierać minimum 6 znaków', {variant: 'error'});
            return false;
        }
        if (!validator.isLength(name,{min:4, max:30})){
            enqueueSnackbar('Zbyt krótka nazwa użytkownika', {variant: 'error'});
            return false;
        }
        if (!state){
            enqueueSnackbar('Wymagane jest zaakceptowanie regulaminu', {variant: 'error'});
            return false;
        }
        return true;
    }
    const reg = () => {
        setButtonDisabled(true);
        if (!validateForm())
        {
            console.log("Błąd walidacji");
            setButtonDisabled(false);
            return false;
        }
        firebase.auth().createUserWithEmailAndPassword(mail, password).then(({user})=>{
            console.log(user);
            var email = mail;
            var userName = name;
            console.log("moj email: ", email);
            console.log("moj nick: ", userName);
            firebase.firestore().collection('Users').doc(user.uid).set({
                email: email,
                userName: userName,
                emailNotification: true,
                pushNotification: true,
                loggedByGoogle: false
            }).then(function(){
                // Create empty collection of Groups with 2 doc (Admins and Members) that contains data = [];
                firebase.firestore().collection("Users").doc(user.uid).collection("Groups").doc("Admins").set({
                    data: []
                })
                firebase.firestore().collection("Users").doc(user.uid).collection("Groups").doc("Members").set({
                    data: []
                })
                setButtonDisabled(false);
            });
        }).catch(function(error) {
            var errorMessage = error.message;
            console.log("firebase auth:",errorMessage);
            enqueueSnackbar('Wystąpił błąd', {variant: 'error'});
            setButtonDisabled(false);
            // ...
          });
        
    }

    return (
        <LoginContainer>
            <Nag>
            <MyText>Rejestracja:</MyText>
            <MyLink to="/login">Powrót</MyLink>
            </Nag>
            <MyInput type="text" id="nname" name="nname" placeholder="imię i nazwisko" onChange={n=>setName(n.target.value)}>
            </MyInput>
            <MyInput type="email" id="fname" name="fname" placeholder="e-mail" onChange={e=>setMail(e.target.value)}>
            </MyInput>
            <MyInput type="password" id="pname" name="pname" placeholder="hasło" onChange={p=>setPassword(p.target.value)}>
            </MyInput>
            <MyInput type="password" id="pname2" name="pname2" placeholder="powtórz hasło" onChange={p2=>setPassword2(p2.target.value)}>
            </MyInput>
            <EmptyBox>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={state}
                            onChange={handleChange}
                            name="checkedB"
                            color="#73909C"
                        />
                    }
                    label="Akceptuję regulamin serwisu"
                />
            </EmptyBox>
            <Buttonscontainer>
            <Button
					color="#73909C"
					type="contained"
					style={{
						width: '60%',
						color: '#fff',
					}}
                    text="Zarejestruj się"
                    onClick={reg}
                    disabled={buttonDisabled}
				/>
            </Buttonscontainer>
        </LoginContainer>
    )
}

const LoginContainer = styled.div`
    min-width: 417px;
    flex-direction: column;
    display: flex;
    color: #73909C;
    font-size: 16px;
`
const MyInput = styled.input`
    border: 2px solid #73909C;
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
    margin: 10px;
    display: flex;
    flex-direction: row;
    color: #73909C;
`
const Buttonscontainer = styled(EmptyBox)`
    flex-direction:row;
    justify-content: space-evenly;
`

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
&:hover{color: #9C9083};
font-weight: medium;
font-size: 14px;
text-align:center;
align-items: center;
margin: 10px;
justify-content:center;
margin-right:12px;
`
