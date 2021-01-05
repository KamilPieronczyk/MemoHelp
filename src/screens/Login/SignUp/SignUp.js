//import { Container } from '@material-ui/core'
//import React from 'react'
import styled from 'styled-components'
//import Checkbox from '@material-ui/core/Checkbox';
import React, { useState } from 'react';
// import { withStyles } from '@material-ui/core/styles';
// import { green } from '@material-ui/core/colors';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import validator from 'validator';
import firebase from 'firebase';
import history from '../../../history';
import {
    // BrowserRouter as Router,
    // Switch,
    // Route,
    Link
  } from "react-router-dom";
import {Button} from '../../../components';
import { min } from 'date-fns';
// const GreenCheckbox = withStyles({
//     root: {
//         color: green[400],
//         '&$checked': {
//             color: green[600],
//         },
//     },
//     checked: {},
// })((props) => <Checkbox color="default" {...props} />);

export function Register(props) {
    const [mail, setMail] = useState("");
    const [password, setPassword]=useState("");
    const [password2,setPassword2]=useState("");
    const [name, setName]=useState("");
    const [state, setState] = useState(false);
    const handleChange = (event) => {
        setState(!state);
    };
    const validateForm = () => {
        if(!validator.isEmail(mail))
            return false;
        if(password!==password2)
            return false;
        if (!validator.isLength(password,{min:6, max:30}))
            return false;
        if (!validator.isLength(name,{min:4, max:30}))
            return false;
        if (!state)
            return false;
        return true;
    }
    const reg = () => {
        if (!validateForm())
        {
            console.log("Błąd walidacji");
            return false;
        }
        firebase.auth().createUserWithEmailAndPassword(mail, password).then(({user})=>{
            //uploadData();
            console.log(user);
            var email = mail;
            var userName = name;
            console.log("moj email: ", email);
            console.log("moj nick: ", userName);
            firebase.firestore().collection('Users').doc(user.uid).set({
                email: email,
                userName: userName
            }).then(function(){
                history.push("/");
                window.location.reload();
            });
        }).catch(function(error) {
            // Handle Errors here.
            //var errorCode = error.code;
            var errorMessage = error.message;
            console.log("firebase auth:",errorMessage);
            // ...
          });
        
    }
    // const uploadData = () => {
    //     var email = mail;
    //     //var user = firebase.auth().currentUser;
    //     var uid = user.uid;
    //     if (user!=null){
    //         // user.providerData.forEach(function(profile){
                
    //         //     console.log(profile);
            
    //         // });
    //         firebase.database().ref('users/' + user.uid).set({
    //             email: email
    //         });
    //     }
        
    // }
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
				/>
            </Buttonscontainer>
        </LoginContainer>
    )
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
    //min-height:50px;
    //min-width:417px;
    margin: 10px;
    display: flex;
    flex-direction: row;
    //text-align:center;
    color: #73909C;
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
