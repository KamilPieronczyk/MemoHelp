import React from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"
import styled from 'styled-components'
import {NavBar} from './components'
import Login from './screens/Login/login'

function App() {
  return (
    <Body>
      <Router>
        <NavBar />
        <Switch>
          <Route path="/login">
            <Login></Login>
          </Route>
          <Route path="/calendar">
            Calendar
          </Route>
          <Route path="/">
            Home
          </Route>
        </Switch>
      </Router>
    </Body>
  );
}

const Body = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 0 120px 0 120px;
  box-sizing: border-box;
  background-image: url("./assets/background.png");
  background-size: cover;
`

export default App;
