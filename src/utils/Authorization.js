import React from 'react';
import firebase from 'firebase';


export default function IsAuthorized() {

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