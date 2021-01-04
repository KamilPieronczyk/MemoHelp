import db from 'firebase'

export const getUserAdminGroupsData = () => {
    // TODO user ID
    var docRef = db.firestore().collection("Users")
                .doc("sQpA99mVpXQnvC0D1IcmNNhlPyr2").collection("Groups").doc("Admins");

    // Getting all array of groups id which user is admin
    docRef.get().then(function(doc) {
        if (doc.exists) {
            let userAdminGroups = new Map();
             // Getting admin (Map), members id (array) and group name
            for(let i = 0; i < doc.data().data.length; i++) {
                var groupId = doc.data().data[i].trim();
                db.firestore().collection("Groups").doc(groupId).get().then(function(doc) {
                    if(doc.exists) {
                        userAdminGroups.set(groupId, {
                            id: groupId,
                            name: doc.data().name, 
                            users: new Map()
                        });
                        // Getting user data from firestore
                        for(let i = 0; i < doc.data().members.length; i++) {
                            var userId = doc.data().members[i].trim();
                            db.firestore().collection("Users").doc(userId).get().then(function(doc) {
                                if(doc.exists){
                                    // TODO remove i !!!!
                                    userAdminGroups.get(groupId).users.set(i, {
                                        id: userId, name: "Radek", surname: "Mo"
                                    })
                                    console.log("TODO:// get user data from firestore");
                                }
                                console.log(`FIREBAE GROUP ${groupId} USER ${userId} INFO: `, userAdminGroups);
                            });
                            console.log(`LOOP GROUP ${groupId} USER ${userId} INFO: `, userAdminGroups);
                        }
                    }
                    console.log(`FIREBASE GROUP ${groupId} INFO: `, userAdminGroups);
                }).catch(function(error) {
                    console.log("Error getting document:", error);
                });
                console.log(`LOOP GROUP ${groupId} INFO: `, userAdminGroups);
            }
            console.log("RESULT: ", userAdminGroups);
            return userAdminGroups;
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
            return new Map();
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
        return new Map();
    });
    return new Map();
}

export const getUserGroupsData = () => {
    // TODO user ID
    var docRef = db.firestore().collection("Users").
                doc("sQpA99mVpXQnvC0D1IcmNNhlPyr2").collection("Groups").doc("Members");
    //Getting all group id where use is only member"
    docRef.get().then(function(doc) {
        if (doc.exists) {
            let userGroups = new Map();
            userGroups.set("G2", {
                id: "G2",
                name: "Grupa2", 
                users: [
                    {id: "P1",name: "Andrzej",surname: "Morawiecki"},
                    {id: "P2",name: "Donald",surname: "Bieden"},
                ]
            });
            return userGroups;
        } else {
            console.log("No such document!");
            return new Map();
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    return new Map();
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