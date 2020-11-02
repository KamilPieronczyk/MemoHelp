//import { Container } from '@material-ui/core'
//import React from 'react'
import styled from 'styled-components'
//import Checkbox from '@material-ui/core/Checkbox';
import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import {Button} from '../../../components';
const GreenCheckbox = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);

export function Register() {
    const [state, setState] = useState({
        checkedA: true,
        checkedB: true,
        checkedF: true,
        checkedG: true,
    });
    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };
    return (
        <LoginContainer>
            <Nag>
            <MyText>Rejestracja:</MyText>
            <MyLink to="/login">Powrót</MyLink>
            </Nag>
            <MyInput type="email" id="fname" name="fname" placeholder="e-mail">
            </MyInput>
            <MyInput type="password" id="pname" name="pname" placeholder="hasło">
            </MyInput>
            <MyInput type="password" id="pname2" name="pname2" placeholder="powtórz hasło">
            </MyInput>
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
                    label="Akceptuję regulamin serwisu"
                />
            </EmptyBox>
            <Buttonscontainer>
            <Button text={"Zarejestruj się"}  
                type='contained'
                css={{
                    height: "48px",
                    width: "50%",
                    color: 'FFFAF5',
                    primary: '73909C'
                }}
                style={{
                    height:"48px"
                }}
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
const Zarejestruj = styled.div`
    //width: 200px;
    //height: 50px;
    //border: 2px solid #73909C;
    background-color: #73909C;
    color: #FFFFFF;
    text-align: center;
    font-size: 16px;
    border-radius: 10px;
    padding: 16px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    padding-right:40px;
    padding-left:40px;
    //width:100%;
`

const Buttonscontainer = styled(EmptyBox)`
    flex-direction:row;
    //display:flex;
    //margin: 10px;
    justify-content: space-evenly;
`


const EmptyBox2 = styled.div`
    //min-height:50px;
    min-width:417px;
    margin: 10px;
    flex-direction: row;
    text-align:center;
    font-weight: bold;
    font-size: 14px;
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