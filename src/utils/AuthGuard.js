import { PortraitSharp } from '@material-ui/icons'
import React, {useEffect} from 'react'
import {useLocation, useHistory} from 'react-router-dom'
import {useUser} from './AuthProvider'

export const AuthGuard = (props) => {
  const location = useLocation()
  const history = useHistory()
  const {isLoggedIn, loading, user} = useUser()

  useEffect(()=>{
    console.log('authguard',isLoggedIn, loading, user)
    if(!location.pathname.toLowerCase().includes('login') && isLoggedIn == false)
    history.replace('/login')
    if(loading) return;
    if(location.pathname.toLowerCase().includes('login') && isLoggedIn == true)
      history.replace('/')
  }, [location, isLoggedIn, user])

  return (
    <React.Fragment>
      {
        loading ?
          "Loading..."
          :
          props.children
      }
    </React.Fragment>
  )
}