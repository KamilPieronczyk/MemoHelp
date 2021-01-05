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
                        // Getting user data invitations from firestore
                        for(let i = 0; i < doc.data().invitations.length; i++) {
                            var userId = doc.data().invitations[i].trim();
                            //TODO:// show invitations
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
export async function firebaseAdminGroupsMapState(NewGroupsMap, EditInfoGroupsMap, NewGroupsMembersMap, RemoveMemebersFromGroupsMap, RemoveGroupsMap) {
    if(NewGroupsMap.size > 0)
		await sendToFirebaseNewGroupsData(NewGroupsMap)

	if(EditInfoGroupsMap.size > 0)
		updateInFirebaseGroupsInfo(EditInfoGroupsMap)
		
	if(NewGroupsMembersMap.size > 0)
		sendToFirebaseNewGroupsMembers(NewGroupsMembersMap)
		
	if(RemoveMemebersFromGroupsMap.size > 0)
        removeFromFirebaseGroupsMembers(RemoveMemebersFromGroupsMap)
    
    if(RemoveGroupsMap.size > 0)
        removeGroupsFromFirebase(RemoveGroupsMap)

}

async function removeGroupsFromFirebase(mp) {
 
    for (const item of mp) {
        let groupId = item[0];
        if(typeof groupId === "number")
            continue;

        var docGroupsRef = db.firestore().collection("Groups").doc(groupId)

        // Remove in user collection groups ID
        await docGroupsRef.get().then(function(doc) {
            if(doc.exists) {
                for(let i = 0; i < doc.data().admin.length; i++) {
                    let id = doc.data().admin[i].id;

                    db.firestore().collection("Users").doc(id).collection("Groups").doc("Admins").update({
                        data: db.firestore.FieldValue.arrayRemove(groupId)
                    }).catch(function(error) {
                        console.error("Error removing document: ", error);
                    });
                }

                for(let i = 0; i < doc.data().members.length; i++) {
                    let id = doc.data().members[i];

                    db.firestore().collection("Users").doc(id).collection("Groups").doc("Members").update({
                        data: db.firestore.FieldValue.arrayRemove(groupId)
                    }).catch(function(error) {
                        console.error("Error removing document: ", error);
                    });
                }
            }
        }).catch(function(error) {
            console.error("Error adding document: ", error);
        });
        
        // Remove group
        docGroupsRef.delete();
    }

    
}

async function sendToFirebaseNewGroupsData(mp) {
    // TODO user ID
    var userId = "sQpA99mVpXQnvC0D1IcmNNhlPyr2";

    for (const item of mp) {

        console.log(item[1]);

        var docUserGroupsRef = db.firestore().collection("Users")
            .doc(userId).collection("Groups").doc("Admins"); 
             
        // Create new group and get ID
        await db.firestore().collection("Groups").add({
            name: item[1].name,
            members: [],
            invitations: [],
            admin: [{id: userId}],
        })
        .then(function(docRef) {
            var groupId = docRef.id;

            // BUG update ID in state.userAdminGroupsView, state.userAdminGroupsMembersView
            console.log("Document written with ID: ", groupId);
            // Add group ID to users Admins aaray
            docUserGroupsRef.update({
                data: db.firestore.FieldValue.arrayUnion(groupId)
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            });

            // TODO: same as in sendToFirebaseNewGroupsMembers()
            for(const newUser of item[1].users) {
                let email = newUser[1].email;

                // TODO get id from email
                db.firestore().collection("Users").where("email", "==", email).get().then(function(querySnapshot) {
                    let emailExists = false;
                    querySnapshot.forEach(function(doc) {
                        //console.log(doc.id, " => ", doc.data());
                        emailExists = true;

                        // Adding group id to user collection
                        var docUserGroupsRef = db.firestore().collection("Users")
                            .doc(doc.id).collection("Groups").doc("Invitations"); 
                        docUserGroupsRef.update({
                            data: db.firestore.FieldValue.arrayUnion(groupId),
                        }).catch(function(error) {
                            console.error("Error update document: ", error);
                        });

                        // Add user to group collection data invitations
                        db.firestore().collection("Groups").doc(groupId).update({
                            invitations: db.firestore.FieldValue.arrayUnion(doc.id),
                        }).catch(function(error) {
                            console.error("Error update document: ", error);
                        });

                    });
                    if(emailExists === false) {
                        // TODO alert
                        console.log("Can't found email", email);
                    }
                })
                .catch(function(error) {
                    console.log("Error getting documents (user id from email): ", error);
                });
            }

        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    }
}

const updateInFirebaseGroupsInfo = (mp) => {
    for (const item of mp) {

        //console.log(item[1]);
   
        // Create new group and get ID
        db.firestore().collection("Groups").doc(item[1].id).update({
            name: item[1].name
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    }
}

const sendToFirebaseNewGroupsMembers = (mp) => {
    console.log(mp)

    for (const item of mp) {
        let groupId = item[0];
        if(typeof groupId === "number")
            continue;
        for(const newUserData of item[1].users) {
            console.log(newUserData);
            let email = newUserData.email;

            // TODO get id from email
            db.firestore().collection("Users").where("email", "==", email).get().then(function(querySnapshot) {
                let emailExists = false;
                querySnapshot.forEach(function(doc) {
                    //console.log(doc.id, " => ", doc.data());
                    emailExists = true;

                    // Adding group id to user collection
                    var docUserGroupsRef = db.firestore().collection("Users")
                        .doc(doc.id).collection("Groups").doc("Invitations"); 
                    docUserGroupsRef.update({
                        data: db.firestore.FieldValue.arrayUnion(groupId),
                    }).catch(function(error) {
                        console.error("Error update document: ", error);
                    });

                    // Add user to group collection data invitations
                    db.firestore().collection("Groups").doc(groupId).update({
                        invitations: db.firestore.FieldValue.arrayUnion(doc.id),
                    }).catch(function(error) {
                        console.error("Error update document: ", error);
                    });

                });
                if(emailExists === false) {
                    // TODO alert
                    console.log("Can't found email", email);
                }
            })
            .catch(function(error) {
                console.log("Error getting documents (user id from email): ", error);
            });

        }
    }
}

const removeFromFirebaseGroupsMembers = (mp) => {
    console.log(mp)

    for (const item of mp) {
        var groupId = item[0];
        for(const userId of item[1].users) {

            // Remove user from group
            db.firestore().collection("Groups").doc(groupId).update({
                members: db.firestore.FieldValue.arrayRemove(userId),
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            });

            // Remove group in user collection
            db.firestore().collection("Users")
            .doc(userId).collection("Groups").doc("Members").update({
                data: db.firestore.FieldValue.arrayRemove(groupId),
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            });
        }
    }
}

export async function firebaseLeftFromGroups(Arr) {
    // TODO user ID
    var userId = "sQpA99mVpXQnvC0D1IcmNNhlPyr2";

    if(Arr.length > 0) {

        var docUserGroupsRef = db.firestore().collection("Users")
            .doc(userId).collection("Groups").doc("Members"); 
             
        for(var i=0; i < Arr.length; i++) {
            let groupId = Arr[i].id;

            // Remove user from group
            await db.firestore().collection("Groups").doc(groupId).update({
                members: db.firestore.FieldValue.arrayRemove(userId),
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            });

            // Remove group in user collection
            docUserGroupsRef.update({
                data: db.firestore.FieldValue.arrayRemove(groupId),
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            });
        }
    }
}

// export const getUserAdminGroupsTestData = () => {
//     let userAdminGroups = new Map();
//     userAdminGroups.set("Friends", {
//         id: "Friends",
//         name: "Friends", 
//         users: new Map()
//     })
//     userAdminGroups.set("G0", {
//         id: "G0",
//         name: "Grupa0", 
//         users: new Map()
//     })
//     userAdminGroups.get("G0").users.set("P0", {
//         id: "P0",name: "Radek", surname: "Mo"
//     })
//     userAdminGroups.get("G0").users.set("P2", {
//         id: "P2",name: "Kamil",surname: "Duda"
//     })
//     userAdminGroups.set("G1", {
//         id: "G1",
//         name: "Grupa1", 
//         users: new Map()
//     })
//     userAdminGroups.get("G1").users.set("P1", {
//         id: "P1",name: "Jan",surname: "Morawiecki"
//     })
//     userAdminGroups.get("G1").users.set("P2", {
//         id: "P2",name: "Kamil",surname: "Duda"
//     })
//     return userAdminGroups
// }

// export const getUserGroupsTestData = () => {
//     let userGroups = new Map();
//     userGroups.set("G2", {
//         id: "G2",
//         name: "Grupa2", 
//         users: [
//             {id: "P1",name: "Andrzej",surname: "Morawiecki"},
//             {id: "P2",name: "Donald",surname: "Bieden"},
//         ]
//     })
//     userGroups.set("G3", {
//         id: "G3",
//         name: "Grupa3", 
//         users: [
//             {id: "P1",name: "Ja",surname: "Mo"},
//             {id: "P2",name: "Ru",surname: "Sto"},
//         ]
//     })
//     return userGroups
// }