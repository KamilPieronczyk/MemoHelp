import React from 'react';
import firebase from 'firebase';


export function IsAuthorized() {

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
        }
        else{
            if(window.location.pathname!="/Login")
            window.location.pathname="/Login";
        }
      });
}
export function IsLoggedIn() {
    console.log(firebase.auth().currentUser);
    if(firebase.auth().currentUser==null)
    return true;
    else return true;
}