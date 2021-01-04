import db from 'firebase'

async function _getUserGroupsData(name) {
    let data = new Map();
    // TODO user data and id
    var docRef = db.firestore().collection("Users")
                .doc("sQpA99mVpXQnvC0D1IcmNNhlPyr2").collection("Groups").doc(name);
    // Getting all array of groups id which user is admin
    await docRef.get().then(async function(doc) {
        if (doc.exists) {
             // Getting admin (Map), members id (array) and group name
            for(let i = 0; i < doc.data().data.length; i++) {
                var groupId = doc.data().data[i].trim();
                await db.firestore().collection("Groups").doc(groupId).get().then(async function(doc) {
                    if(doc.exists) {
                        if(name == "Admins") {
                            data.set(groupId, {
                                id: groupId,
                                name: doc.data().name, 
                                users: new Map()
                            });
                        } else {
                            data.set(groupId, {
                                id: groupId,
                                name: doc.data().name, 
                                users: []
                            });
                        }
                        // Getting user data from firestore
                        for(let i = 0; i < doc.data().members.length; i++) {
                            var userId = doc.data().members[i].trim();
                            await db.firestore().collection("Users").doc(userId).get().then(async function(doc) {
                                if(doc.exists){
                                    // TODO names and surname
                                    if(name == "Admins") {
                                        data.get(groupId).users.set(userId, {
                                            id: userId, name: "Radek", surname: "Mo"
                                        })
                                    } else {
                                        data.get(groupId).users.push(
                                            {id: userId, name: "Radek", surname: "Mo"}
                                        )
                                    }
                                    console.log("TODO:// get user data from firestore");
                                }
                            });
                        }
                    }
                }).catch(function(error) {
                    console.log("Error getting document:", error);
                });
            }
        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    return data;
}

export async function getUserAdminGroupsData() {
    let data = await _getUserGroupsData("Admins");
    return data;
}

export async function getUserGroupsData() {
    let data = await _getUserGroupsData("Members");
    return data;
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