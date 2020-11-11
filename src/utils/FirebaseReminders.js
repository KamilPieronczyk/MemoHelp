import firebase from 'firebase';
import {atom} from 'recoil'

export class Reminder {
    SendReminderToUserCollection(){
    firebase.firestore().collection('Users').doc(firebase.auth().currentUser.uid)
    .collection('Reminders').add({
            text: this.textContent,
            date: this.date,
            time: this.time,
            frequency: this.frequency,
            weekDays: this.weekDays
    })
    }

    SendReminderToGroupCollection(groupID){
    firebase.firestore().collection('Groups').doc(groupID)
    .collection('Reminders').add({
            text: this.textContent,
            date: this.date,
            time: this.time,
            frequency: this.frequency,
            weekDays: this.weekDays,
            usersGroup: this.usersGroup
    })
    };
}

export const textContentState = atom({
    key: 'textContent',
    default: ''    
})

export const dateState = atom({
    key: 'date',
    default: new Date()    
})

export const weekDaysState = atom({
    key: 'weekDays',
    default: null    
})

export const timeState = atom({
    key: 'time',
    default: new Date()    
})

export const frequencyState = atom({
    key: 'frequency',
    default: ''    
})

