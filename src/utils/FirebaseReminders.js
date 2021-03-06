import { ContactSupportOutlined } from '@material-ui/icons';
import firebase from 'firebase';
import { atom } from 'recoil';

export class Reminder {
	static reminderTypes = {
		default  : 'DEFAULT',
		cyclical : 'CYCLICAL',
		special  : 'SPECIAL'
	};
	type;
	textContent;
	date;
	time;
	frequency;						// everyDay, everyWeek, everyMonth, everyYear
	weekDays;
	usersGroup;

	SendReminderToUserCollection() {
		//firebase.firestore().collection('Users').doc(firebase.auth().currentUser.uid)
		console.log(this.textContent);
		return new Promise((resolve, reject) => {
			firebase
				.firestore()
				.collection('Users')
				.doc(firebase.auth().currentUser.uid)
				.collection('Reminders')
				.add({
					text      : this.textContent,
					date      : this.date,
					frequency : this.frequency,
					weekDays  : this.weekDays,
					type      : this.type
				})
				.then(() => resolve())
				.catch(() => reject());
		});
	}

	SendReminderToGroupCollection(groupID) {
		console.log(`SendReminderToGroupCollection( ${groupID} )`);
		return new Promise((resolve, reject) => {
			firebase.firestore().collection('Groups').doc(groupID).collection('Reminders').add({
				text       : this.textContent,
				date       : this.date,
				frequency  : this.frequency,
				weekDays   : this.weekDays,
				admin      : firebase.auth().currentUser.uid,
				usersGroup : groupID
			})
			.then(async doc => {
				let reminderId = doc.id;
				await firebase.firestore().collection('Groups').doc(groupID).get().then(async doc => {
					if(doc.exists) {
						var membersId = doc.data().members;
						var adminsId = doc.data().admin;
						var usersIdArray = [...adminsId, ...membersId]
						console.log("Group reminder users", reminderId, usersIdArray);
						for(let i = 0; i < usersIdArray.length; i++) {
							let userId = usersIdArray[i];
							console.log(reminderId, userId);
							await firebase
								.firestore()
								.collection('Users')
								.doc(userId)
								.collection('Reminders')
								.doc(reminderId)
								.set({
									text      : this.textContent,
									date      : this.date,
									frequency : this.frequency,
									weekDays  : this.weekDays,
									type      : this.type,
									group	  : groupID,
									admin     : firebase.auth().currentUser.uid,
								}).then(() => {}).catch(e => console.log(e))
						}
					}
				});
				resolve()
			})
			.catch(() => reject());
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

export const typeState = atom({
	key     : 'reminderType',
	default : Reminder.reminderTypes.default
});

/**
 * Function get all users group
 * @return data.set(groupId, {selected: false, name: String, usersId: []});
 */
export async function getAllGroups() {
    let data = new Map();

	if(firebase.auth().currentUser === null) return data;

	let userId = firebase.auth().currentUser.uid;

	var docRefAdmin = firebase.firestore().collection("Users").doc(userId).collection("Groups").doc("Admins");
	var docRefMember = firebase.firestore().collection("Users").doc(userId).collection("Groups").doc("Members");
    
    try {

		// Getting all arrays of groups id
		var docGroupsAdmin = await docRefAdmin.get();
		var docGroupsMember = await docRefMember.get();
		let adminGroupsId;
		let memberGroupsId;

		if (docGroupsAdmin.exists) {
			adminGroupsId = docGroupsAdmin.data().data;
		}

		if(docGroupsMember.exists) {
			memberGroupsId = docGroupsMember.data().data;
		}	
		
		var groupsIdArray = [...adminGroupsId, ...memberGroupsId]

		for(let i = 0; i < groupsIdArray.length; i++) {
			var groupId = groupsIdArray[i].trim(); 

			// Create emtpy map - key is group id
			data.set(groupId, {selected: false, name: "", usersId: []});

			try {

				let docGroupData = await firebase.firestore().collection("Groups").doc(groupId).get();

				// Save admin and member id to array
				if(docGroupData.exists) {
					var tmp = [...docGroupData.data().admin, ...docGroupData.data().members]
					data.get(groupId).usersId = tmp
					data.get(groupId).name = docGroupData.data().name
				}

			} catch(e) {
				console.log(e)
			}

		}

    } catch(e) {
        console.log(e);
	}
	
    return data;
}

/**
 * Function get all users groups id
 * @return array of id
 */
export async function getGroupsIds() {
 
	if(firebase.auth().currentUser === null) return [];

	let userId = firebase.auth().currentUser.uid;

	var docRefAdmin = firebase.firestore().collection("Users").doc(userId).collection("Groups").doc("Admins");
	var docRefMember = firebase.firestore().collection("Users").doc(userId).collection("Groups").doc("Members");
    
    try {

		// Getting all arrays of groups id
		var docGroupsAdmin = await docRefAdmin.get();
		var docGroupsMember = await docRefMember.get();
		let adminGroupsId;
		let memberGroupsId;

		if (docGroupsAdmin.exists) {
			adminGroupsId = docGroupsAdmin.data().data;
		}

		if(docGroupsMember.exists) {
			memberGroupsId = docGroupsMember.data().data;
		}	
		
		var groupsIdArray = [...adminGroupsId, ...memberGroupsId]

		return groupsIdArray;

    } catch(e) {
		console.log(e);
		return new Array();
	}
	
}