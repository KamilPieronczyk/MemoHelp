import React, {useEffect} from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"
import styled from 'styled-components'
import {NavBar} from './components'
import {Calendar} from './screens/Calendar/Calendar'
import Login from './screens/Login/login'
import {Home} from './screens'
import Settings from './screens/Settings/Settings'
import Groups from './screens/Groups/Groups'
import browserHistory from './history';
import {AuthProvider, AuthGuard, NotificationsProvider} from './utils'

function App() {
  return (
    <AuthProvider>
      <NotificationsProvider />
      <Body>
        <Router history={browserHistory}>
          <AuthGuard>
            <NavBar />
            <Switch>
              <Route path="/login/:path?">
                <Login></Login>
              </Route>
              <Route path="/calendar">
                <Calendar></Calendar>
              </Route>
              <Route path="/settings">
                <Settings />
              </Route>
              <Route path="/Groups">
                <Groups />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </AuthGuard>
        </Router>
      </Body>
    </AuthProvider>
  );
}

const Body = styled.div`
  min-width: 95vw;
  min-height: 100vh;
  padding: 0 120px 0 120px;
  box-sizing: border-box;
  background-image: url("./assets/background.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
`


export default App;
