import React, { useState } from 'react';
import styles from './Settings.module.css';
import {Button} from '../../components/index';
import Switch from '@material-ui/core/Switch';

function Settings() {
    const user = {
        name: 'Jan',
        surname: 'Kowalski',
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
            {id: 'email', name: "Zmień email", fun: updateEmail, warningState: state.emailWarning, warning: 'Na nowy email został wysłany link aktywacyjny'},
            {id: 'new-passwd', name: "Nowe hasło", fun: updatePasswd, warningState: state.newPasswdWarning, warning: 'Nowe hasło nie może być krótsze niż 5 znaków'},
         {id: 'passwd', name: "Podaj hasło", fun: passwd, warningState: state.passwdWarning, warning: 'Podałeś nieprawidłowe hasło'}
        ]
    };

    const notify = {
        name: 'Ogólne',
        elements: [
            {id: 'push', name: "Push", state: state.notifyPush},
            {id: 'email', name: "Email", state: state.notifyEmail}
        ]
    };

    return (
    <div className={styles.container}>
        <div className={styles.content}>
            <div className={styles.header}>
                <div style={{backgroundImage: `url(${state.imgUri})`}}>
                    <label htmlFor="image">
                        <span aria-hidden="true">Zmień avatar</span>
                        <input type="file" id="image" style={{display: 'none'}} onChange={changeAvatar}></input>
                    </label>
                </div>
                <span>{user.name} {user.surname}</span>
            </div>
            <div className={styles.settings}>
                <div>
                    <div style={{fontSize: 20}}>
                        <span>{general.name}</span>
                    </div>
                    <div className={styles.settingsContentBox}>
                        {general.elements.map(item => {
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
                        })}
                        <div className={styles.settingsOption}>
                            <div style={{width: '25%'}}>
                                <label htmlFor="language">Język</label>
                            </div>
                            <div className={styles.htmlType}>
                                <select name="language" onChange={updateLang}>
                                    <option value="english">English</option>
                                    <option value="polish">Polski</option>
                                </select>
                            </div>
                        </div>
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
                <Button text={"Zamknij konto"} callback={closeAccount} 
                css={{
                    width: '30%',
                    color: 'black',
                    hover: {
                        backgroundColor: 'gray',
                    },
                    active: {
                        backgroundColor: 'green',
                    }
                }}
                />
                <Button text={"Zamknij konto"} callback={applySettings} 
                css={{
                    width: '60%',
                    color: 'black',
                    hover: {
                        backgroundColor: 'gray',
                    },
                    active: {
                        backgroundColor: 'green',
                        color: 'white'
                    }
                }}
                />
            </div>
        </div>
    </div>
    );

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