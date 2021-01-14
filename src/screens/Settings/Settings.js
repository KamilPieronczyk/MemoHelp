import React, { useState } from 'react';
import styles from './Settings.module.css';
import {Button} from '../../components/index';
import Switch from '@material-ui/core/Switch';
import styled from 'styled-components';
import firebase from 'firebase';
import { useSnackbar } from 'notistack';
import validator from 'validator';
import {useUser} from '../../utils';


function Settings() {   
    const [state, setState] = useState({
        emailWarning: false,
        newPasswdWarning: false,
        passwdWarning: false,
        push: true,
        email: true,
    });
 

    const notify = {
        name: 'Powiadomienia',
        elements: [
            {id: 'push', name: "Push", state: state.notifyPush},
            {id: 'email', name: "Email", state: state.notifyEmail}
        ]
    };

    const [ mail, setMail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ password2, setPassword2 ] = useState('');
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [ name, setName ] = useState('');
    const {user}=useUser();
    

    const apply = () => {
        var email = mail;
        var oldPass = password;
        var newPass = password2;
        var newName = name;
        var user = firebase.auth().currentUser;
        var credential=firebase.auth.EmailAuthProvider.credential(
            user.email,
            oldPass
        );
        var userName = user.userName;
        var oldMail = user.email;
        
        if(!(email || oldPass || newPass || newName))
        {
            console.log("puste pola");
            return;
        }
        //PASSWORD
        if((!email) && oldPass && newPass && (!newName))
        {
            
            user.reauthenticateWithCredential(credential).then(function() {
                // User re-authenticated.
                console.log("dziala weryfikacja");
                if (!validator.isLength(newPass,{min:6, max:30})){
                    enqueueSnackbar('Nowe hasło musi zawierać minimum 6 znaków', {variant: 'error'});
                    return;
                }
                user.updatePassword(newPass).then(function() {
                    // Update successful.
                    console.log("haslo zaktualizowane");
                    enqueueSnackbar('Hasło zostało zaktualizowane', {variant: 'success'});
                  }).catch(function(error) {
                    // An error happened.
                    console.log("blad zmiany hasla");
                    enqueueSnackbar('Wystąpił błąd', { variant: 'error' });
                  });
            }).catch(function(error) {
                // An error happened.
                console.log("blad");
                enqueueSnackbar('Podaj poprawne hasło', { variant: 'error' });
            });
        }
        //MAIL
        if((email) && oldPass && (!newPass) && (!newName))
        {
            user.reauthenticateWithCredential(credential).then(function() {
                // User re-authenticated.
                console.log("dziala weryfikacja");
                if(!validator.isEmail(email)){
                    enqueueSnackbar('Błędny adres email', {variant: 'error'});
                    return;
                }
                user.updateEmail(email).then(function() {
                    // Update successful.
                    firebase.firestore().collection('Users').doc(user.uid).set({
                        email: email,
                        userName: userName
                    },{merge: true}).then(function(){
                        enqueueSnackbar('Adres email został zaktualizowany', {variant: 'success'});
                    });
                  }).catch(function(error) {
                    // An error happened.
                    enqueueSnackbar('Wystąpił błąd', { variant: 'error' });
                  });
            }).catch(function(error) {
                // An error happened.
                console.log("blad");
                enqueueSnackbar('Podaj poprawne hasło', { variant: 'error' });
            });
        }
        //MAIL AND PASSWORD
        if((email) && oldPass && (newPass) && (!newName))
        {
            user.reauthenticateWithCredential(credential).then(function() {
                // User re-authenticated.
                console.log("dziala weryfikacja");
                if(!validator.isEmail(email)){
                    enqueueSnackbar('Błędny adres email', {variant: 'error'});
                    return;
                }
                if (!validator.isLength(newPass,{min:6, max:30})){
                    enqueueSnackbar('Nowe hasło musi zawierać minimum 6 znaków', {variant: 'error'});
                    return;
                }
                user.updateEmail(email).then(function() {
                    // Update successful.
                    user.updatePassword(newPass).then(function() {
                        // Update successful.
                        console.log("haslo zaktualizowane");
                        firebase.firestore().collection('Users').doc(user.uid).set({
                            email: email,
                            userName: userName
                        },{merge: true}).then(function(){
                            enqueueSnackbar('Hasło i email zostały zaktualizowane', {variant: 'success'});
                        });
                      }).catch(function(error) {
                        // An error happened.
                        console.log("blad zmiany hasla");
                        enqueueSnackbar('Wystąpił błąd przy zmianie hasła', { variant: 'error' });
                      });
                  }).catch(function(error) {
                    // An error happened.
                    enqueueSnackbar('Wystąpił błąd przy zmianie adresu email', { variant: 'error' });
                  });
            }).catch(function(error) {
                // An error happened.
                console.log("blad");
                enqueueSnackbar('Podaj poprawne hasło', { variant: 'error' });
            });
        }
        //MAIL AND USERNAME
        if((email) && oldPass && (!newPass) && (newName))
        {
            user.reauthenticateWithCredential(credential).then(function() {
                // User re-authenticated.
                console.log("dziala weryfikacja");
                if(!validator.isEmail(email)){
                    enqueueSnackbar('Błędny adres email', {variant: 'error'});
                    return;
                }
                if (!validator.isLength(newName,{min:4, max:30})){
                    enqueueSnackbar('Zbyt krótka nazwa użytkownika', {variant: 'error'});
                    return;
                }
                user.updateEmail(email).then(function() {
                    // Update successful.
                    firebase.firestore().collection('Users').doc(user.uid).set({
                        email: email,
                        userName: newName
                    },{merge: true}).then(function(){
                        enqueueSnackbar('Adres email i nazwa zostały zaktualizowane', {variant: 'success'});
                    })
                  }).catch(function(error) {
                    // An error happened.
                    enqueueSnackbar('Wystąpił błąd', { variant: 'error' });
                  });
            }).catch(function(error) {
                // An error happened.
                console.log("blad");
                enqueueSnackbar('Podaj poprawne hasło', { variant: 'error' });
            });
        }
        //MAIL AND PASSWORD AND USERNAME
        if((email) && oldPass && (newPass) && (newName))
        {
            user.reauthenticateWithCredential(credential).then(function() {
                // User re-authenticated.
                console.log("dziala weryfikacja");
                if(!validator.isEmail(email)){
                    enqueueSnackbar('Błędny adres email', {variant: 'error'});
                    return;
                }
                if (!validator.isLength(newPass,{min:6, max:30})){
                    enqueueSnackbar('Nowe hasło musi zawierać minimum 6 znaków', {variant: 'error'});
                    return;
                }
                if (!validator.isLength(newName,{min:4, max:30})){
                    enqueueSnackbar('Zbyt krótka nazwa użytkownika', {variant: 'error'});
                    return;
                }
                user.updateEmail(email).then(function() {
                    // Update successful.
                    firebase.firestore().collection('Users').doc(user.uid).set({
                        email: email,
                        userName: newName
                    },{merge: true}).then(function(){
                    user.updatePassword(newPass).then(function() {
                        // Update successful.
                        console.log("haslo zaktualizowane");
                        enqueueSnackbar('Dane zostały zaktualizowane', {variant: 'success'});
                      }).catch(function(error) {
                        // An error happened.
                        console.log("blad zmiany hasla");
                        enqueueSnackbar('Wystąpił błąd przy zmianie hasła', { variant: 'error' });
                      });
                    });
                  }).catch(function(error) {
                    // An error happened.
                    enqueueSnackbar('Wystąpił błąd przy zmianie adresu email', { variant: 'error' });
                  });
            }).catch(function(error) {
                // An error happened.
                console.log("blad");
                enqueueSnackbar('Podaj poprawne hasło', { variant: 'error' });
            });
        }
        //NO PASSWORD
        if((newPass || newName || email) && (!oldPass))
        {
            enqueueSnackbar('Aby wprowadzić zmiany musisz podać hasło', { variant: 'error' });
            return;
        }
        //PASSWORD AND USERNAME
        if((!email) && newPass && newName && oldPass)
        {
            user.reauthenticateWithCredential(credential).then(function() {
                // User re-authenticated.
                console.log("dziala weryfikacja");
                if (!validator.isLength(newPass,{min:6, max:30})){
                    enqueueSnackbar('Nowe hasło musi zawierać minimum 6 znaków', {variant: 'error'});
                    return;
                }
                if (!validator.isLength(newName,{min:4, max:30})){
                    enqueueSnackbar('Zbyt krótka nazwa użytkownika', {variant: 'error'});
                    return;
                }
                user.updatePassword(newPass).then(function() {
                    // Update successful.
                    console.log("haslo zaktualizowane");
                    //enqueueSnackbar('Hasło zostało zaktualizowane', {variant: 'success'});
                    firebase.firestore().collection('Users').doc(user.uid).set({
                        email: oldMail,
                        userName: newName
                    },{merge: true}).then(function(){
                        enqueueSnackbar('Dane zostały zaktualizowane', {variant: 'success'});
                    });
                  }).catch(function(error) {
                    // An error happened.
                    console.log("blad zmiany hasla");
                    enqueueSnackbar('Wystąpił błąd', { variant: 'error' });
                  });
            }).catch(function(error) {
                // An error happened.
                console.log("blad");
                enqueueSnackbar('Podaj poprawne hasło', { variant: 'error' });
            });
        }
        //USERNAME
        if((!email) && oldPass && (!newPass) && (newName))
        {
            user.reauthenticateWithCredential(credential).then(function() {
                // User re-authenticated.
                console.log("dziala weryfikacja");
                if (!validator.isLength(newName,{min:4, max:30})){
                    enqueueSnackbar('Zbyt krótka nazwa użytkownika', {variant: 'error'});
                    return;
                }
                firebase.firestore().collection('Users').doc(user.uid).set({
                    email: oldMail,
                    userName: newName
                },{merge: true}).then(function(){
                    enqueueSnackbar('Nazwa użytkownika została zaktualizowana', {variant: 'success'});
                });
              }).catch(function(error) {
                // An error happened.
                console.log("blad zmiany pseudonimu");
                enqueueSnackbar('Wystąpił błąd', { variant: 'error' });
            }).catch(function(error) {
                // An error happened.
                console.log("blad");
                enqueueSnackbar('Podaj poprawne hasło', { variant: 'error' });
            });
        }
    };

    const deleteUser = () => {
        var user = firebase.auth().currentUser;
        var psw = password;
        var credential=firebase.auth.EmailAuthProvider.credential(
            user.email,
            psw
        );
        user.reauthenticateWithCredential(credential).then(function() {
                // User re-authenticated.
                console.log("dziala!");
                user.delete().then(function() {
                    // User deleted.
                    console.log("bye bye");
                  }).catch(function(error) {
                    // An error happened.
                    console.log("error when removing user");
                    enqueueSnackbar('Wystąpił błąd', { variant: 'error' });
                  });
            }).catch(function(error) {
                // An error happened.
                console.log("blad");
                enqueueSnackbar('Podaj poprawne hasło', { variant: 'error' });
            });
        
    };

    const gApply = () => {
        var newName = name;
        if (!validator.isLength(newName,{min:4, max:30})){
            enqueueSnackbar('Zbyt krótka nazwa użytkownika', {variant: 'error'});
            return;
        }
        firebase.firestore().collection('Users').doc(user.uid).set({
            userName: newName
        },{merge: true}).then(function(){
            enqueueSnackbar('Nazwa użytkownika została zaktualizowana', {variant: 'success'});
        });
    }

    const gDeleteUser = () => {
        var user = firebase.auth().currentUser;
        user.delete().then(function() {
            // User deleted.
          }).catch(function(error) {
            // An error happened.
            enqueueSnackbar('Wymagana autoryzacja - zaloguj się ponownie, by usunąć konto', {variant: 'error'});
          });
    }

    if(user.loggedByGoogle == true) {
        return (
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.header}>
                        <div style={{fontSize: 48}}>
                            <span>{user.userName}</span>
                        </div>
                    </div>
                    <div className={styles.settings}>
                        <div>
                            <div style={{fontSize: 20}}>
                                <span>Ogólne</span>
                            </div>
                            <div className={styles.settingsContentBox}>
                                <MyInput type="text" id="nname" name="nname" placeholder="zmień pseudonim" onChange={(n) => setName(n.target.value)} />  
                            </div>
                        </div>
                        <div>
                            <div style={{fontSize: 20, marginTop: 12}}>
                                <span>{notify.name}</span>
                            </div>
                            <div className={styles.settingsContentBox}>
                                {notify.elements.map(item => {
                                    return(
                                        <div className={styles.settingsOption} key={item.name}>
                                            <div style={{width: '25%'}}>
                                                <label>{item.name}</label>
                                            </div>
                                            <div className={styles.generalUserValue}>
                                                <Switch
                                                    id={item.id}
                                                    checked={item.state}
                                                    onChange={notifySwitch}
                                                    color="primary"
                                                    name={item.name}
                                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                                                /> 
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className={styles.buttons}>
                        <Button text={"Zamknij konto"} onClick={gDeleteUser} 
                        type='outlined'
                        color="#73909C"
                        style={{
                            width: '35%',
                            color: '#73909C',
                        }}
                        />
                        <Button text={"Zatwierdź zmiany"} onClick={gApply} 
                        type='contained'
                        color="#73909C"
                        style={{
                            width: '60%',
                            color: '#FFF',
                        }}
                        />
                    </div>
                </div>
            </div>
            )
    }

    return (
    <div className={styles.container}>
        <div className={styles.content}>
            <div className={styles.header}>
                <div style={{fontSize: 48}}>
                    <span>{user.userName}</span>
                </div>
            </div>
            <div className={styles.settings}>
                <div>
                    <div style={{fontSize: 20}}>
                        <span>Ogólne</span>
                    </div>
                    <div className={styles.settingsContentBox}>
                        <MyInput type="text" id="nname" name="nname" placeholder="podaj nowy pseudonim" onChange={(n) => setName(n.target.value)} />
                        <MyInput type="email" id="fname" name="fname" placeholder="podaj nowy adres email" onChange={(e) => setMail(e.target.value)} />
                        <MyInput type="password" id="pname2" name="pname2" placeholder="podaj nowe hasło" onChange={(p2) => setPassword2(p2.target.value)} />
                        <MyInput type="password" id="pname" name="pname" placeholder="podaj stare hasło" onChange={(p) => setPassword(p.target.value)} />
                    </div>
                </div>
                <div>
                    <div style={{fontSize: 20, marginTop: 12}}>
                        <span>{notify.name}</span>
                    </div>
                    <div className={styles.settingsContentBox}>
                        {notify.elements.map(item => {
                            return(
                                <div className={styles.settingsOption} key={item.name}>
                                    <div style={{width: '25%'}}>
                                        <label>{item.name}</label>
                                    </div>
                                    <div className={styles.generalUserValue}>
                                        <Switch
                                            id={item.id}
                                            checked={item.state}
                                            onChange={notifySwitch}
                                            color="primary"
                                            name={item.name}
                                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        /> 
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className={styles.buttons}>
                <Button text={"Zamknij konto"} onClick={deleteUser} 
                type='outlined'
                color="#73909C"
                style={{
                    width: '35%',
                    color: '#73909C',
                }}
                />
                <Button text={"Zatwierdź zmiany"} onClick={apply} 
                type='contained'
                color="#73909C"
                style={{
                    width: '60%',
                    color: '#FFF',
                }}
                />
            </div>
        </div>
    </div>
    )

    function notifySwitch(event) {
        console.log(`${event.target.id} ${event.target.checked}`);
        setState({ ...state, [event.target.id]: event.target.checked });
        var user = firebase.auth().currentUser;
        if (event.target.id=='email')
        {
            console.log('email notification');
            firebase.firestore().collection('Users').doc(user.uid).set({
                emailNotification: event.target.checked
            },{merge:true});
        }
        if (event.target.id=='push')
        {
            console.log('push notification');
            firebase.firestore().collection('Users').doc(user.uid).set({
                pushNotification: event.target.checked
            },{merge: true});
        }
    };



}

export default Settings;

const MyInput = styled.input`
	border: 2px solid #73909c;
	//min-height:50px;
	margin: 10px;
	font-family: 'Roboto', sans-serif;
	color: #73909c;
	font-size: 12px;
	border-radius: 10px;
	padding: 12px;
	background-color: transparent;
	&:focus {
		border-radius: 10px;
		border-color: #73909c;
		outline: none;
	}
	&:active {
		border-radius: 10px;
		border-color: #73909c;
		outline: none;
	}
`;