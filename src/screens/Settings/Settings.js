import React, { useState } from 'react';
import styles from './Settings.module.css';
import {Button} from '../../components/index';
import Switch from '@material-ui/core/Switch';
import styled from 'styled-components';
import firebase from 'firebase';
import { useSnackbar } from 'notistack';
import validator from 'validator';


function Settings() {

   

    const user = {
        userName: 'Jan',
        imgUri: "https://www.pecetowicz.pl/uploads/monthly_2018_07/images.thumb.jpg.3728ccb69a0144c0e5196794a5541bfe.jpg"
    };

    
    
    const [state, setState] = useState({
        emailWarning: false,
        newPasswdWarning: false,
        passwdWarning: false,
        push: true,
        email: true,
        imgUri: user.imgUri
    });
    
    const general = {
        name: 'Ogólne',
        elements: [
            {id: 'passwd', name: "Podaj hasło", fun: passwd, warningState: state.passwdWarning, warning: 'Podałeś nieprawidłowe hasło'},
            {id: 'email', name: "Zmień email", fun: updateEmail, warningState: state.emailWarning, warning: 'Na nowy email został wysłany link aktywacyjny'},
            {id: 'new-passwd', name: "Nowe hasło", fun: updatePasswd, warningState: state.newPasswdWarning, warning: 'Nowe hasło nie może być krótsze niż 5 znaków'}
         
        ]
    };

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
        /////////////////////////////////////
        //PRZEPISANE NA NOWO
        /////////////////////////////////////
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
                    }).then(function(){
                        enqueueSnackbar('Adres email został zaktualizowany', {variant: 'success'});
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
                        enqueueSnackbar('Hasło i email zostały zaktualizowane', {variant: 'success'});
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
                    }).then(function(){
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
                    }).then(function(){
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
                    }).then(function(){
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
                }).then(function(){
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
    return (
    <div className={styles.container}>
        <div className={styles.content}>
            <div className={styles.header}>
                {/* <div style={{backgroundImage: `url(${state.imgUri})`}}>
                    <label htmlFor="image">
                        <span aria-hidden="true">Zmień avatar</span>
                        <input type="file" id="image" style={{display: 'none'}} onChange={changeAvatar}></input>
                    </label>
                </div> */}
                <span>{user.userName}</span>
            </div>
            <div className={styles.settings}>
                <div>
                    <div style={{fontSize: 20}}>
                        <span>{general.name}</span>
                    </div>
                    <div className={styles.settingsContentBox}>
                        {/* {general.elements.map(item => {
                            return (
                                <div key={item.name}>
                                    <div className={styles.settingsOption}>
                                        <div style={{width: '25%'}}>
                                            <label htmlFor={item.id}>{item.name}</label>
                                        </div>
                                        <div className={styles.htmlType} onChange={item.fun}> 
                                            <input style={{width: '100%'}} type="text" name={item.id} />
                                        </div>
                                    </div>
                                    {item.warningState === true &&
                                        <div className={styles.warning}>
                                            <span>{item.warning}</span>
                                        </div>
                                    }
                                </div>
                            )
                        })} */}
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
    };

    function changeAvatar(event) {
        console.log(`Avatar path: ${event.target.value}`);
        setState({...state, imgUri: `https://avatarfiles.alphacoders.com/126/thumb-126644.gif`});
    }

    function updateEmail(event) {
        console.log(`Update email: ${event.target.value}`);
        if(event.target.value !== "")
            setState({...state, emailWarning: true});
        else setState({...state, emailWarning: false});
    }

    function updatePasswd(event) {
        console.log(`Update password: ${event.target.value}`);
        if(event.target.value !== "")
            setState({...state, newPasswdWarning: true});
        else setState({...state, newPasswdWarning: false});
    }

    function passwd(event) {
        console.log(`Current password: ${event.target.value}`);
        if(event.target.value !== "")
            setState({...state, passwdWarning: true});
        else setState({...state, passwdWarning: false});
    }

    function updateLang(event) {
        console.log(`Update language: ${event.target.value}`);
    }

    function applySettings() {
        console.log("Click: save new settings");
    }

    function closeAccount() {
        console.log("Click: close account");
    }

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