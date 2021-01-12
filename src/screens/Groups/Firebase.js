import db from 'firebase'
/**
 * Function get from firestore all groups data
 * @param {if you want get all data group which user is admin type TRUE, otherwise false} admin
 */
async function _getUserGroupsData(admin) {
    let data = new Map();

    let mainDoc = "Members";
    if(admin) mainDoc = "Admins"

    let id = await db.auth().currentUser.uid;

    var docRef = db.firestore().collection("Users").doc(id).collection("Groups").doc(mainDoc);
    
    try {
        // Getting all arrays of groups id
        var docGroups = await docRef.get();

        if (docGroups.exists) {

            // Getting admin (Map), members id (array) and group name
            for(let i = 0; i < docGroups.data().data.length; i++) {

                var groupId = docGroups.data().data[i].trim();

                try {

                    let docGroupData = await db.firestore().collection("Groups").doc(groupId).get();

                    if(docGroupData.exists) {

                        data.set(groupId, {
                            id: groupId,
                            name: docGroupData.data().name, 
                            users: admin ? new Map() : []
                        });

                        // Getting user data from firestore
                        for(let i = 0; i < docGroupData.data().members.length; i++) {

                            var userId = docGroupData.data().members[i].trim();

                            try{

                                let docUserData = await db.firestore().collection("Users").doc(userId).get();

                                if(docUserData.exists){
                                    if(admin) {
                                        data.get(groupId).users.set(userId, {
                                            id: userId, userName: docUserData.data().userName
                                        })
                                    } else {
                                        data.get(groupId).users.push({
                                            id: userId, userName: docUserData.data().userName
                                        })
                                    }
                                }

                            } catch(e) {
                                console.log(e);
                            }
                        }

                        // Getting user invitations data from firestore
                        for(let i = 0; i < docGroupData.data().invitations.length; i++) {

                            var userId = docGroupData.data().invitations[i].trim();

                            try{

                                let docUserData = await db.firestore().collection("Users").doc(userId).get();

                                if(docUserData.exists){
                                    if(admin) {
                                        data.get(groupId).users.set(userId, {
                                            id: userId, userName: docUserData.data().userName, invitations: true
                                        })
                                    } else {
                                        data.get(groupId).users.push({
                                            id: userId, userName: docUserData.data().userName, invitations: true
                                        })
                                    }
                                }

                            } catch(e) {
                                console.log(e);
                            }
                        }
                    }
                } catch(e) {
                    console.log(e)
                }
            }
        }
    } catch(e) {
        console.log(e);
    }
    return data;
}

/**
 * Function get all groups data which user has admin permission
 */
export async function getUserAdminGroupsData() {
    let data = await _getUserGroupsData(true);
    return data;
}

/**
 * Function get all groups data which user has not admin permission
 */
export async function getUserGroupsData() {
    let data = await _getUserGroupsData(false);
    return data;
}

/**
 * Method update firesotre data when user approves the changes
 * @warning admin applet
 * @param {state.TMP_AdminGroupsNew - map containing new created groups} NewGroupsMap 
 * @param {state.TMP_AdminGroupsEditInfo - map containing edited groups names} EditInfoGroupsMap 
 * @param {state.TMP_AdminGroupsAddMembers - map containing invitations} NewGroupsMembersMap 
 * @param {state.TMP_AdminGroupsRemoveMembers- map containing the group's expelled users} RemoveMemebersFromGroupsMap 
 * @param {state.TMP_AdminDeleteGroups - map containg removed groups} RemoveGroupsMap 
 * @return map which contain new firesotre groups and user id when groups or users added/removed
 */
export async function firebaseAdminGroupsMapState(NewGroupsMap, EditInfoGroupsMap, NewGroupsMembersMap, RemoveMemebersFromGroupsMap, RemoveGroupsMap) {
    
    var updates = new Map;

    if(NewGroupsMap.size > 0) {
        updates.set("NEW-GROUPS-USERS-ID", await sendToFirebaseNewGroupsData(NewGroupsMap))
    }   
        
        
    if(NewGroupsMembersMap.size > 0) {
        updates.set("NEW-USERS-ID", await sendToFirebaseNewGroupsMembers(NewGroupsMembersMap))
    }
		
	if(EditInfoGroupsMap.size > 0)
		updateInFirebaseGroupsInfo(EditInfoGroupsMap)
		
	
	if(RemoveMemebersFromGroupsMap.size > 0)
        removeFromFirebaseGroupsMembers(RemoveMemebersFromGroupsMap)
    
    if(RemoveGroupsMap.size > 0)
        removeGroupsFromFirebase(RemoveGroupsMap)

    return updates;
}

/**
 * Functions removes users from groups
 * @param {user to removed from groups, group id is key} mp 
 */
async function removeGroupsFromFirebase(mp) {
 
    for (const item of mp) {
        let groupId = item[0];

        if(typeof groupId === "number") continue;

        var docGroupsRef = db.firestore().collection("Groups").doc(groupId)

        // Remove in user collection groups ID
        await docGroupsRef.get().then(function(doc) {
            if(doc.exists) {
                for(let i = 0; i < doc.data().admin.length; i++) {
                    let id = doc.data().admin[i];

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

                for(let i = 0; i < doc.data().invitations.length; i++) {
                    let id = doc.data().invitations[i];

                    db.firestore().collection("Users").doc(id).collection("GroupsInvitations").doc(groupId).delete()
                    .catch(function(error) {
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

/**
 * Functions add new groups data to firebase and send invitations to new memebers
 * @param {*} mp 
 * @return updats map
 */
async function sendToFirebaseNewGroupsData(mp) {
    // TODO user ID
    var userId = await db.auth().currentUser.uid;

    let updats = new Map();

    for (const item of mp) {
        var randomGroupId = item[0];
        var groupName = item[1].name;
        var docUserGroupsRef = db.firestore().collection("Users")
            .doc(userId).collection("Groups").doc("Admins"); 
             
        // Create new group and get ID
        await db.firestore().collection("Groups").add({
            name: item[1].name,
            members: [],
            invitations: [],
            admin: [userId],
        })
        .then(async function(docRef) {
            var groupId = docRef.id;

            updats.set(randomGroupId, {
                id: docRef.id,
                users: new Map() 
            });

            console.log("Document written with ID: ", groupId);
            // Add group ID to users Admins aaray
            docUserGroupsRef.update({
                data: db.firestore.FieldValue.arrayUnion(groupId)
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            });

            for(const newUser of item[1].users) {
                var randomUserId = newUser[1].id;
                let email = newUser[1].email;

                // Send invitations
                let obj = await _sendInvitations(groupId, groupName, email)
                updats.get(randomGroupId).users.set(randomUserId, obj)
            }

        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    }

    return updats;
}

/**
 * Functions updates groups name
 * @param {*} mp 
 */
const updateInFirebaseGroupsInfo = (mp) => {
    for (const item of mp) {
        db.firestore().collection("Groups").doc(item[1].id).update({
            name: item[1].name
        }).catch(function(error) {
            console.error(error);
        });
    }
}

/**
 * Functions send invitations to new memebers
 * @param {*} mp 
 * @return updats map
 */
async function sendToFirebaseNewGroupsMembers(mp) {
    console.log(mp)

    let updates = new Map();

    for (const item of mp) {
        let groupId = item[0];
        if(typeof groupId === "number")
            continue;
        
            updates.set(groupId, {
            users: new Map() 
        });

        let groupName = item[1].name;

        for(const newUserData of item[1].users) {
            var randomUserId = newUserData.id;
            let email = newUserData.email;

            // Send invitations
            let obj = await _sendInvitations(groupId, groupName, email)
            updates.get(groupId).users.set(randomUserId, obj)
        }
    }

    return updates;
}

/**
 * Send invitaitons to users
 * @param {handle changes} userList 
 * @param {group dd firesotre} groupId
 * @param {*} groupName 
 * @param {*} email 
 * @param {*} userRandId 
 */
async function _sendInvitations(groupId, groupName, email) {

    var obj = {
        email: email
    }

    let adminId = await db.auth().currentUser.uid;
    let adminUserName = await db.firestore().collection("Users").doc(adminId).get().then(doc => {
        if(doc.exists) {
            return doc.data().userName;
        } else return "NO_FOUND_NAME";
    });

    await db.firestore().collection("Users").where("email", "==", email).get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {

            let invitation = {
                id: groupId,
                msg: `${adminUserName} zaprosił się do grupy ${groupName}`
            }

            try {
                // Adding group id to user collection
                db.firestore().collection("Users").doc(doc.id).collection("GroupsInvitations").doc(groupId).set(invitation);;

                // Add user to group collection data invitations
                db.firestore().collection("Groups").doc(groupId).update({
                    invitations: db.firestore.FieldValue.arrayUnion(doc.id)
                });

                obj = {
                    id: doc.id,
                    userName: doc.data().userName
                }

            } catch(e) {
                console.log(e);
            }

        });
    })
    .catch(function(error) {
        console.log("Error getting documents (user id from email): ", error);
    });

    return obj;
}

/**
 * Functions remove memebers from groups
 * @param {*} mp 
 */
const removeFromFirebaseGroupsMembers = (mp) => {
    console.log(mp)

    for (const item of mp) {
        var groupId = item[0];
        for(const userId of item[1].users) {

            try {
                // Remove user from group
                db.firestore().collection("Groups").doc(groupId).update({
                    members: db.firestore.FieldValue.arrayRemove(userId),
                });
                // Remove group in user collection
                db.firestore().collection("Users").doc(userId).collection("Groups").doc("Members").update({
                    data: db.firestore.FieldValue.arrayRemove(groupId),
                });
            } catch(e) {
                console.log(e);
            }
            
        }
    }
}

/**
 * Function contain actions when user want left from gorup
 * @param {array of groups id} arr 
 */
export async function firebaseLeftFromGroups(arr) {
    // TODO user ID
    var userId = await db.auth().currentUser.uid;

    if(arr.length > 0) {

        var docUserGroupsRef = db.firestore().collection("Users").doc(userId).collection("Groups").doc("Members"); 
             
        for(var i=0; i < arr.length; i++) {
            let groupId = arr[i].id;
            
            try {
                 // Remove user from group
                db.firestore().collection("Groups").doc(groupId).update({
                    members: db.firestore.FieldValue.arrayRemove(userId)
                });
                // Remove group in user collection
                docUserGroupsRef.update({
                    data: db.firestore.FieldValue.arrayRemove(groupId)
                });
            } catch(e) {
                console.log(e);
            }
        }
    }
}
