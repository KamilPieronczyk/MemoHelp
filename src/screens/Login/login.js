//import { Container } from '@material-ui/core'
//import React from 'react'
import styled from 'styled-components'
//import Checkbox from '@material-ui/core/Checkbox';
import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const GreenCheckbox = withStyles({
    root: {
      color: green[400],
      '&$checked': {
        color: green[600],
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);

export default function Login(){
    const [state, setState] = useState({
      checkedA: true,
      checkedB: true,
      checkedF: true,
      checkedG: true,
    });
    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
      };

    return(
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
                    <LoginContainer>
                        <MyInput type="email" id="fname" name="fname" placeholder="e-mail">
                        </MyInput>
                        <MyInput type="password" id="pname" name="pname" placeholder="hasło">
                        </MyInput>
                        <EmptyBox>
                        <FormControlLabel
                            control={
                            <Checkbox
                                checked={state.checkedB}
                                onChange={handleChange}
                                name="checkedB"
                                color="primary"
                            />
                            }
                            label="Pamiętaj mnie"
                         />
                        </EmptyBox>
                        <Buttonscontainer>
                            <Google>
                                Zaloguj się
                            </Google>
                            <Zaloguj>
                                Zaloguj się
                            </Zaloguj>
                        </Buttonscontainer>
                        <EmptyBox2>
                            Jeżeli nie masz konta, stwórz je
                        </EmptyBox2>
                    </LoginContainer>
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
    justify-content: space-around;
    align-items: center;
    align-content: center;
`
const FlexboxItem=styled.div`
    //width: 200px; 
    //margin: 10px;
    //border: 3px solid #333;
    //background-color: #dfdfdf;
`
const FlexboxItem1=styled.div`
    //min-width:100px;
    min-height: 100px;
    //align-self:center;
`
const FlexboxItem2=styled.div`
    min-height: 200px;
    //align-self: center;
`
const LoginContainer=styled.div`
    //min-height: 300px;
    min-width: 417px;
    //background-color: #dfdfdf;
    flex-direction: column;
    display: flex;
`
const Img=styled.img`
`
const Tytul=styled.div`
    //background-color: #dfdfdf;
    //min-width: 50px;
    font-size: 56px;
    font-family: 'Cinzel', serif;
    margin: auto;
    width:50%;
    text-align:center;
`
const Box=styled.div`
    border: 2px solid #73909C;
    //min-height:50px;
    margin: 10px;
    font-family: 'Roboto', sans-serif;
    color: #73909C;
    font-size: 16px;
    border-radius: 10px;
    padding: 16px;
`
const EmptyBox=styled.div`
    min-height:50px;
    min-width:417px;
    margin: 10px;
    display: flex;
    flex-direction: row;
    //text-align:center;
    color: #73909C;
`
const SmallBox=styled.div`
    //border: 2px solid #73909C;
    //height:25px;
    //width:25px;
    //border-radius: 5px;
`
const EmptyBox2=styled.div`
    //min-height:50px;
    min-width:417px;
    margin: 10px;
    flex-direction: row;
    text-align:center;
    font-weight: bold;
    font-size: 14px;
`
const Zaloguj=styled.div`
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
`
const Google=styled.div`
    //width: 200px;
    //height: 50px;
    //border: 2px solid #FFFFFF;
    background-color: #FFFFFF;
    //color: #FFFFFF;
    text-align: center;
    font-size: 16px;
    border-radius: 10px;
    color: black;
    padding: 16px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`
const Buttonscontainer=styled(EmptyBox)`
    flex-direction:row;
    //margin: 10px;
    justify-content: space-around;
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