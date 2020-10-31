
import { Grid, Paper } from "@material-ui/core";
import React from "react"
import styled from 'styled-components'

export function Calendar(){



    var monthDays = new Array(7*6);
    var now = new Date();

    var startingDate = new Date(now.setDate(1));
    var calendarStartingDate = new Date(startingDate.setDate(startingDate.getDate() - startingDate.getDay() + 1));
    console.log("StartingNumber: " + calendarStartingDate);
    
    const days = [];
    var i = 0;
    for(var x = 1; x<=6; x++){
        const row = [];
        for(var y = 1; y<=7; y++){
            monthDays[i] = calendarStartingDate.getDate();
            calendarStartingDate.setDate(calendarStartingDate.getDate() + 1);
            row.push(
            <Grid item xs auto alignContent = 'space-around'>
               <div style = {{backgroundColor: 'white', height: 100, margin: 1, border: 'black',}}>
                   <p style = {{textAlign: "center" ,color: "black"}}>
                   {monthDays[i]}
                   </p>
                </div>
            </Grid>
            );
            i++;
        }
        days.push(
            <Grid container item 
            alignItems = 'stretch'
            alignContent = 'space-around'
            spacing = {0}
            >
                    {row}
            </Grid>
        )
    }
    

    return( 
        <Grid container spacing ={0}
        alignContent = 'space-around'
        style = {{backgroundColor:'white'}}>
            {days}
        </Grid>
    )

}