import firebase from 'firebase';
import { atom } from 'recoil';

export class Reminder {
	textContent;
	date;
	time;
	frequency;
	weekDays;
	usersGroup;

	SendReminderToUserCollection() {
		//firebase.firestore().collection('Users').doc(firebase.auth().currentUser.uid)
		console.log(this.textContent);
		firebase.firestore().collection('Users').doc('sQpA99mVpXQnvC0D1IcmNNhlPyr2').collection('Reminders').add({
			text      : this.textContent,
			date      : this.date,
			frequency : this.frequency,
			weekDays  : this.weekDays
		});
	}

	SendReminderToGroupCollection(groupID) {
		firebase.firestore().collection('Groups').doc(groupID).collection('Reminders').add({
			text       : this.textContent,
			date       : this.date,
			frequency  : this.frequency,
			weekDays   : this.weekDays,
			usersGroup : this.usersGroup
		});
	}
}

export const textContentState = atom({
	key     : 'textContent',
	default : ''
});

export const dateState = atom({
	key     : 'date',
	default : new Date()
});

export const weekDaysState = atom({
	key     : 'weekDays',
	default : []
});

export const timeState = atom({
	key     : 'time',
	default : new Date()
});

export const frequencyState = atom({
	key     : 'frequency',
	default : ''
});
