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
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if(user != null) {
        setIsLoggedIn(true)
        setUser(user)
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