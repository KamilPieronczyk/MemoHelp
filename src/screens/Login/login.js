//import { Container } from '@material-ui/core'
//import React from 'react'
import styled from 'styled-components'
//import Checkbox from '@material-ui/core/Checkbox';
import React, { useState } from 'react';
import {LoginForm} from './SignIn/SignIn';
import {
    BrowserRouter as Router,
    Switch,
    Route
  } from "react-router-dom";
import {Register} from './SignUp/SignUp';
import {Recover} from './Recover/Recover';

export default function Login() {


    return (
        <FlexboxContainerContainer>
            <Tytul>Memo helper</Tytul>
            <FlexboxContainer>
                <FlexboxItem>
                    <FlexboxItem1>
                        <Img src="/assets/loginIcon.png"></Img>
                    </FlexboxItem1>
                </FlexboxItem>
                <FlexboxItem>
                    <FlexboxItem2>
                        <Img src="/assets/hr.png"></Img>
                    </FlexboxItem2>
                </FlexboxItem>
                <FlexboxItem>
                    <Switch>
                        <Route exact path="/login/reg">
                            <Register />
                        </Route>
                        <Route exact path="/login/recover">
                            <Recover />
                        </Route>
                        <Route path="/login">
                            <LoginForm />
                        </Route>
                    </Switch>
                </FlexboxItem>
            </FlexboxContainer>
        </FlexboxContainerContainer>
    )
}

const FlexboxContainerContainer = styled.div`
    display: flex;
    //justify-content: space-around;
    //align-items: center;
    //align-content: center;
    flex-direction: column;
`
const FlexboxContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    
`
const FlexboxItem = styled.div`
    //width: 200px; 
    &:nth-child(1){
        margin-right:200px;
    }
    &:nth-child(2){
        margin-right:200px;
    }
    //border: 3px solid #333;
    //background-color: #dfdfdf;
    
`
const FlexboxItem1 = styled.div`
    //min-width:100px;
    min-height: 100px;
    //align-self:center;
`
const FlexboxItem2 = styled.div`
    min-height: 200px;
    //align-self: center;
`

const Img = styled.img`
`
const Tytul = styled.div`
    //background-color: #dfdfdf;
    //min-width: 50px;
    font-size: 56px;
    font-family: 'Cinzel', serif;
    margin: auto;
    width:50%;
    text-align:center;
`
const Box = styled.div`
    border: 2px solid #73909C;
    //min-height:50px;
    margin: 10px;
    font-family: 'Roboto', sans-serif;
    color: #73909C;
    font-size: 16px;
    border-radius: 10px;
    padding: 16px;
`


