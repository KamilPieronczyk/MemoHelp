import React from "react"
import styled from 'styled-components'

const dayNames = ['pon', 'wto', 'śro', 'czw', 'pią', 'sob', 'nie'];
const monthNames = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
var now = new Date();

var startingDate = new Date(now.setDate(1));
var calendarStartingDate = new Date(startingDate.setDate(startingDate.getDate() - ((startingDate.getDay() + 7) % 8) + 1));

var remindersList = [
    {
        day: 20,
        month: 11,
        year: 2020,
        time: '10:30',
        text: 'cos tam bla bla',
    }
]

export function Calendar() {
    return (
        <div>
            <p style={{ color: "black", fontSize: 24, fontWeight: 'Bold', marginTop: -30 }}>
                {monthNames[now.getMonth()]} {now.getFullYear()}
            </p>
            <GridContainer>
                <PrepareCalendarDays />
            </GridContainer>
        </div>
    )
}

class PrepareCalendarDays extends React.Component {
    render() {
        const days = [];
        var monthDays = [];
        for (var i = 1; i <= 6 * 7; i++) {
            monthDays[i] = calendarStartingDate.getDate();
            calendarStartingDate.setDate(calendarStartingDate.getDate() + 1);
            var reminders = new Array;

            for (var j = 0; j < remindersList.length; j++) {
                if (calendarStartingDate.getMonth() + 1 == remindersList[j].month && monthDays[i] == remindersList[j].day) {
                    console.error("reminder: ", remindersList[j]);
                    reminders.push(
                        remindersList[j]
                    );
                }
            }

            days.push(
                <CalendarDay key={i} i={i} dayNumber={monthDays[i]} reminds={reminders} />
            );
        }
        return days;
    }
}

function CalendarDay(props) {
    var reminds = [];
    // console.log("props: ",props);
    props.reminds.forEach((remind) => {
        reminds.push(
            <ReminderLabel>
                <ReminderTime>
                    {remind.time}
                </ReminderTime>
                <ReminderText>
                    {remind.text}
                </ReminderText>
            </ReminderLabel>
        )
    });

    return (
        <GridItem>
            {props.i <= 7 ? <p style={{ textAlign: "center", color: "gray", fontSize: 14, fontWeight: 'Medium', marginTop: -3, marginBottom: 1 }}>{dayNames[props.i - 1]}</p> : null}
            <DayNumber>
                {props.dayNumber}
            </DayNumber>
            {reminds}
        </GridItem>
    )
}

const GridContainer = styled.div`
    display: grid;
    grid-auto-rows: repeat(6, 1fr);
    height:100%;
    grid-template-columns: repeat(7, 1fr);
    border-right: #9C9083 solid 1px;
    border-bottom: #9C9083 solid 1px;
    border-radius: 12px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`

const GridItem = styled.div`
    display: flex;
    flex-direction: column;
    background-color: white;
    padding: 0px;
    border-left: #9C9083 solid 1px;
    border-top: #9C9083 solid 1px;

    &:nth-child(1){border-top-left-radius: 12px;};
    &:nth-child(7){border-top-right-radius: 12px;};
    &:nth-child(36){border-bottom-left-radius: 12px;};
    &:nth-child(42){border-bottom-right-radius: 12px;};
`
const ReminderLabel = styled.div`
    display: flex;
    margin: 5px;
    flex-grow: 0;
    justify-content: flex-start;
    align-items: center;
    background-color: #9C9083;
    vertical-align: middle;
    border-radius: 12px;
`
const ReminderTime = styled.p`
    color: white;
    margin:0;
    margin-left: 5px;
    text-align: left;
    padding: 0;
    font-weight:500;
    font-size:8px;
`

const ReminderText = styled.p`
    text-align: center;
    padding: 0;
    margin:5px;
    margin-left:5px;
    margin-right:5px;
    color: white;
    font-weight: 500;
    font-size: 8px;
`

const DayNumber = styled.p`
    text-align: center;
    color: black;
    font-size: 12px; 
    font-weight: bold;
    margin-top: 0px;
`