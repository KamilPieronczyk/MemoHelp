import firebase from 'firebase'

export const getUserAdminGroupsData = () => {
    let userAdminGroups = new Map();
    userAdminGroups.set("Friends", {
        id: "Friends",
        name: "Friends", 
        users: new Map()
    })
    return userAdminGroups
}

export const getUserGroupsData = () => {
    let userGroups = new Map();
    return userGroups
}

/** 
* state.TMP_AdminGroupsNew,
* state.TMP_AdminGroupsEditInfo,
* state.TMP_AdminGroupsAddMembers,
* state.TMP_AdminGroupsRemoveMembers
 */
export const firebaseAdminGroupsMapState = (NewGroupsMap, EditInfoGroupsMap, NewGroupsMembersMap, RemoveMemebersFromGroupsMap) => {
    if(NewGroupsMap.size > 0)
		sendToFirebaseNewGroupsData(NewGroupsMap)

	if(EditInfoGroupsMap.size > 0)
		updateInFirebaseGroupsInfo(EditInfoGroupsMap)
		
	if(NewGroupsMembersMap.size > 0)
		sendToFirebaseNewGroupsMembers(NewGroupsMembersMap)
		
	if(RemoveMemebersFromGroupsMap.size > 0)
		removeFromFirebaseGroupsMembers(RemoveMemebersFromGroupsMap)

}

const sendToFirebaseNewGroupsData = (Map) => {
    console.log(Map)
}

const updateInFirebaseGroupsInfo = (Map) => {
    console.log(Map)
}

const sendToFirebaseNewGroupsMembers = (Map) => {
    console.log(Map)
}

const removeFromFirebaseGroupsMembers = (Map) => {
    console.log(Map)
}

export const firebaseLeftFromGroups = (Arr) => {
    if(Arr.length > 0) {
        console.log(Arr)
    }
}

export const getUserAdminGroupsTestData = () => {
    let userAdminGroups = new Map();
    userAdminGroups.set("Friends", {
        id: "Friends",
        name: "Friends", 
        users: new Map()
    })
    userAdminGroups.set("G0", {
        id: "G0",
        name: "Grupa0", 
        users: new Map()
    })
    userAdminGroups.get("G0").users.set("P0", {
        id: "P0",name: "Radek", surname: "Mo"
    })
    userAdminGroups.get("G0").users.set("P2", {
        id: "P2",name: "Kamil",surname: "Duda"
    })
    userAdminGroups.set("G1", {
        id: "G1",
        name: "Grupa1", 
        users: new Map()
    })
    userAdminGroups.get("G1").users.set("P1", {
        id: "P1",name: "Jan",surname: "Morawiecki"
    })
    userAdminGroups.get("G1").users.set("P2", {
        id: "P2",name: "Kamil",surname: "Duda"
    })
    return userAdminGroups
}

export const getUserGroupsTestData = () => {
    let userGroups = new Map();
    userGroups.set("G2", {
        id: "G2",
        name: "Grupa2", 
        users: [
            {id: "P1",name: "Andrzej",surname: "Morawiecki"},
            {id: "P2",name: "Donald",surname: "Bieden"},
        ]
    })
    userGroups.set("G3", {
        id: "G3",
        name: "Grupa3", 
        users: [
            {id: "P1",name: "Ja",surname: "Mo"},
            {id: "P2",name: "Ru",surname: "Sto"},
        ]
    })
    return userGroups
}