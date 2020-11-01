
import { Grid, Paper } from "@material-ui/core";
import React from "react"
import styled from 'styled-components'

export function Calendar(){
    const dayNames = ['pon', 'wto', 'śro', 'czw', 'pią', 'sob', 'nie'];
    const monthNames = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
    var monthDays = new Array(7*6);
    var now = new Date();

    var startingDate = new Date(now.setDate(1));
    var calendarStartingDate = new Date(startingDate.setDate(startingDate.getDate() - ((startingDate.getDay()+7)%8) + 1));
    //console.log("StartingNumber: " + calendarStartingDate + "\nStarting date: " + startingDate);

    const days = [];

    for(var i = 1; i<=6*7; i++){
        monthDays[i] = calendarStartingDate.getDate();
        calendarStartingDate.setDate(calendarStartingDate.getDate() + 1);
        if(i<=7){
            days.push(
                <GridItem>
                <p style = {{textAlign: "center" ,color: "gray", fontSize: 24, fontWeight: 'Medium', marginTop: -30}}>{dayNames[i-1]}</p>
                <p style = {{textAlign: "center" ,color: "black", fontSize: 18, fontWeight: 'Bold', marginTop: -25}}>
                 {monthDays[i]}
                </p>
                </GridItem>
                );
        }else{
            days.push(
                <GridItem>
                <p style = {{textAlign: "center" ,color: "black", fontSize: 18, fontWeight: 'Bold', marginTop: -25}}>
                 {monthDays[i]}
                </p>
                </GridItem>
                );
        }
    }  

    return( 
        <div>
        <p style = {{color: "black", fontSize: 24, fontWeight: 'Bold', marginTop: -30}}>
            {monthNames[now.getMonth()]} {now.getFullYear()}
        </p>
        <GridContainer>
            {days}
        </GridContainer>
        </div>
    )
}

const GridContainer = styled.div`
display: grid;
height: 90%;
grid-auto-rows: 1fr;
background-color: #9C9083;
border-radius: 25;
grid-template-columns: repeat(7, auto);
padding-right: 1px;
padding-bottom: 1px;
`

const GridItem = styled.div`
padding: 30px;
background-color: white;
margin-left: 1px;
margin-top: 1px;
`