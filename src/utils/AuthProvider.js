import React, {useState, useEffect, useContext} from 'react'
import firebase from 'firebase';

export const AuthContext = React.createContext({
  loading: true,
  isLoggedIn: false,
  user: null
});

export const useUser = () => useContext(AuthContext)

export function AuthProvider(props){
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(()=>{
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      console.log('authprovider', isLoggedIn, loading, user)
      if(user != null) {
        try {
          let userData = await getUserDataFromFirestore(user.uid)
          setUser({...user, ...userData})
        } catch (error) {
          console.error(error)
          setUser(user)
        }
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false)
        setUser(null)
      }
      setLoading(false)
    })
    return () => {
      unsubscribe()
    }
  }, [])

  let contextValue = {
    isLoggedIn, loading, user
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
}

const getUserDataFromFirestore = (userId) => {
  return new Promise((resolve, reject)=>{
    firebase.firestore().collection('Users').doc(userId).get().then((snap) => {
      if(snap.exists)
        resolve(snap.data())
      else
        reject("Users doesn't exists in the firestore")
    }).catch((e)=>{
      reject(e)
    })
  })
}