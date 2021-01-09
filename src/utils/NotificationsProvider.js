import React, {useState, useEffect} from 'react'
import firebase from 'firebase'
import {useUser} from './AuthProvider'

const publicVapidKey = 'BBznZsasCYYiWohfBSJ-grbU5wxiaX7c5sw7uiJ6_zaW9k0roG655FOdNNm0KmXvfdQwIoDdl6COMwXWUuAuUlg'

export const NotificationsProvider = () => {
  const {user, isLoggedIn} = useUser()

  useEffect(()=>{
    if(!isLoggedIn || user == null) return;
    firebase.messaging().getToken({vapidKey: publicVapidKey}).then(async (currentToken) => {
      if (currentToken) {
        try {
          await sendTokenToUser(user.uid, currentToken)
        } catch (error) {
          console.log(error)
        }
      } else {
        // Show permission request.
        console.log('No registration token available. Request permission to generate one.');
        // Show permission UI.
        //updateUIForPushPermissionRequired();
        //setTokenSentToServer(false);
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });
  }, [user, isLoggedIn])

  return (
    <React.Fragment />
  )
}

const sendTokenToUser = (userId, token) => {
  return firebase.firestore().collection('Users').doc(userId).set({token}, {merge: true})
}