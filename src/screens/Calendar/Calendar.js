import React from "react"
import styled from 'styled-components'

export function Calendar(){

    var monthDays = new Array(7*6);
    var now = new Date();

    var startingDate = new Date(now.setDate(1));
    var calendarStartingDate = new Date(startingDate.setDate(startingDate.getDate() - startingDate.getDay() + 1));
    console.log("StartingNumber: " + calendarStartingDate);
    
    const days = [];
    for(var i = 1; i<=7*6; i++){
        monthDays[i] = calendarStartingDate.getDate();
        calendarStartingDate.setDate(calendarStartingDate.getDate() + 1);
        days.push(<li>{monthDays[i]}</li>);
    }

    return(
        <div>
            {days}
        </div>
    )
}