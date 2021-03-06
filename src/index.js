import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import firebase from 'firebase/app';
import {RecoilRoot} from 'recoil';
import {SnackbarProvider} from 'notistack'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('../firebase-messaging-sw.js')
  .then(function(registration) {
    console.log('Registration successful, scope is:', registration.scope);
  }).catch(function(err) {
    console.log('Service worker registration failed, error:', err);
  });
}

const firebaseConfig = {
  apiKey: "AIzaSyCJ380bCZ3ukDzkf8dV09B0BqMQPPaN3u4",
  authDomain: "memohelp.firebaseapp.com",
  databaseURL: "https://memohelp.firebaseio.com",
  projectId: "memohelp",
  storageBucket: "memohelp.appspot.com",
  messagingSenderId: "882484536209",
  appId: "1:882484536209:web:49acd2ff387b98c97c7030",
  measurementId: "G-LDVD4K1EZJ"
};

firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <RecoilRoot>
    <React.StrictMode>
      <SnackbarProvider>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <App />
      </SnackbarProvider>
    </React.StrictMode>
  </RecoilRoot>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
