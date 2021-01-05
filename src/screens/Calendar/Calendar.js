import React, { useEffect, useRef, useState } from "react"
import styled from 'styled-components'
import { IsAuthorized } from '../../utils';
import { IsLoggedIn } from '../../utils';
import firebase from 'firebase';
import { useSetRecoilState } from "recoil";

const dayNames = ['pon', 'wto', 'śro', 'czw', 'pią', 'sob', 'nie'];
const monthNames = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
var now = new Date();

var user = 'sQpA99mVpXQnvC0D1IcmNNhlPyr2';

var wheelListener = false;
var startingDate = new Date(now.setDate(1));
var calendarStartingDate = new Date(startingDate.setDate(startingDate.getDate() - ((startingDate.getDay() + 7) % 8) + 1));

var remindersList = new Array();

async function LoadReminders(currentMonth, callback) {
    if (remindersList.length == 0) {
        const db = firebase.firestore();
        const remindersCollection = db.collection('Users').doc(user).collection("Reminders");
        const snapshot = await remindersCollection.get();

        if (!remindersCollection.empty) {
            remindersList = new Array();
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
                var date = new Date(doc.data().date.seconds * 1000);
                console.log("Date: ", date);
                remindersList.push({
                    day: date.getDate(),
                    month: date.getMonth() + 1,
                    year: date.getFullYear(),
                    time: date.getHours() + ':' + date.getMinutes(),
                    text: doc.data().text
                });
            });
        } else {
            console.log("Reminders Collection is empty");
        }
    }
    callback(currentMonth + 1);
    callback(currentMonth);
}


export function Calendar() {
    IsAuthorized();

    const calendarDivRef = useRef();
    const [month, setMonth] = useState(now.getMonth());

    const setMonthListener = (e) => {
        var value = (e.deltaY > 0) ? 1 : -1;
        console.log(e.deltaY + " " + value);
        now.setDate(1);
        now.setMonth(now.getMonth() + value);
        setMonth(now.getMonth());
        now.setDate(1);
        console.log("month: ", now.getMonth() + 1);
        return false;
    }
    
    useEffect(() => {
        LoadReminders(now.getMonth(), (date) => { setMonth(date); });
        document.addEventListener("wheel", setMonthListener, true);
        return () => { document.removeEventListener("wheel", setMonthListener, true) };
    }, []);

    startingDate = new Date(now.setDate(1));
    calendarStartingDate = new Date(startingDate.setDate(startingDate.getDate() - ((startingDate.getDay() + 7) % 8) + 0));
    if (IsLoggedIn())
        return (
            <CalendarDiv ref={calendarDivRef}>
                <p style={{ color: "black", fontSize: 24, fontWeight: 'Bold' }}>
                    {monthNames[now.getMonth()]} {now.getFullYear()}
                </p>
                <Wrapper>
                    <GridContainer>
                        <PrepareCalendarDays />
                    </GridContainer>
                </Wrapper>

            </CalendarDiv>
        )
    else
        return (
            <div />
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
                    // console.error("reminder: ", remindersList[j]);
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

const CalendarDiv = styled.div`
display: flex;
flex-grow: 1;
flex-direction: column;
`

const GridContainer = styled.div`
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    display: grid;
    margin-bottom: 15px;
    grid-template-rows: repeat(6, 1fr);
    grid-template-columns: repeat(7, 1fr);
    border-right: #9C9083 solid 1px;
    border-bottom: #9C9083 solid 1px;
    border-radius: 12px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

`

const Wrapper = styled.div`
    flex-grow: 1;
    position: relative;
`

const GridItem = styled.div`
    display: flex;
    flex-direction: column;
    align-self: stretch;
    background-color: white;
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
    justify-content: left;
    align-items: center;
    background-color: #B593C9;
    vertical-align: middle;
    border-radius: 12px;
`
const ReminderTime = styled.p`
    color: white;
    margin:0;
    margin-left: 10px;
    text-align: left;
    padding: 0;
    font-weight:500;
    font-size:12px;
`

const ReminderText = styled.p`
    text-align: center;
    padding: 0;
    margin:5px;
    margin-left:5px;
    margin-right:10px;
    color: white;
    font-weight: 500;
    font-size: 12px;
`

const DayNumber = styled.p`
    text-align: center;
    color: black;
    font-size: 12px;
    font-weight: bold;
    margin-top: 0px;
`