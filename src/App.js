import React from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"
import styled from 'styled-components'
import {NavBar} from './components'
import Settings from "./screens/Settings/Settings";

function App() {
  /*return (
    
    <Body>
      <Router>
        <NavBar />
        <Switch>
          <Route path="/login">
            Login
          </Route>
          <Route path="/calendar">
            Calendar
          </Route>
          <Route path="/S">
            Home
          </Route>
        </Switch>
      </Router>
    </Body>
  );
  */
  return (
    <Settings />
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
