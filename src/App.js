import React from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"
import styled from 'styled-components'
import {NavBar} from './components'
import Login from './screens/Login/login'
import {Home} from './screens'
import Settings from './screens/Settings/Settings'

function App() {
  return (
    <Body>
      <Router>
        <NavBar />
        <Switch>
          <Route path="/login/:path?">
            <Login></Login>
          </Route>
          <Route path="/calendar">
            Calendar
          </Route>
          <Route path="/settings">
            <Settings />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </Body>
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
`


export default App;
