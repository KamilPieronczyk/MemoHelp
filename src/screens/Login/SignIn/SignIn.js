import styled from 'styled-components';
import React, { useState } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import validator from 'validator';
import firebase from 'firebase';
import { Link } from 'react-router-dom';
import { Button } from '../../../components';
import { useSnackbar } from 'notistack';

export function LoginForm() {
	const [ state, setState ] = useState(false);
	const handleChange = (event) => {
		setState(!state);
	};
	const [ mail, setMail ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ buttonDisabled, setButtonDisabled ] = useState(false);
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const validateForm = () => {
		if (!validator.isEmail(mail)) {
			return false;
		}
		if (!validator.isLength(password, { min: 6, max: 30 })) {
			return false;
		}
		return true;
	};
	const login = () => {
		setButtonDisabled(true);
		if (!validateForm()) {
			enqueueSnackbar('Błędne dane logowania', { variant: 'error' });
			console.log('Błąd walidacji');
			setButtonDisabled(false);
			return false;
		}
		if (!state) {
			firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(() => {
				firebase
					.auth()
					.signInWithEmailAndPassword(mail, password)
					.then(() => {
						console.log('zalogowano');
						setButtonDisabled(false);
					})
					.catch(function(error) {
						// Handle Errors here.
						//var errorCode = error.code;
						var errorMessage = error.message;
						console.log('firebase auth:', errorMessage);
						enqueueSnackbar('Błędne dane logowania', { variant: 'error' });
						setButtonDisabled(false);
						// ...
					});
			});
		} else {
			firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
				firebase
					.auth()
					.signInWithEmailAndPassword(mail, password)
					.then(() => {
						console.log('zalogowano');
						setButtonDisabled(false);
					})
					.catch(function(error) {
						// Handle Errors here.
						//var errorCode = error.code;
						var errorMessage = error.message;
						console.log('firebase auth:', errorMessage);
						enqueueSnackbar('Błędne dane logowania', { variant: 'error' });
						setButtonDisabled(false);
						// ...
					});
			});
		}
	};
	var provider = new firebase.auth.GoogleAuthProvider();
	const gLogin = () => {
		setButtonDisabled(true);
		provider.setCustomParameters({
			login_hint : 'user@example.com'
		});
		firebase
			.auth()
			.signInWithPopup(provider)
			.then(function(result) {
				var credential = result.credential;

				// This gives you a Google Access Token. You can use it to access the Google API.
				var token = result.credential.accessToken;
				// The signed-in user info.
				var user = result.user;
				// ...
				console.log('zalogowano gmail (chyba)');

				var user = firebase.auth().currentUser;
				var email = user.email;
				var userName = user.displayName;

				firebase
					.firestore()
					.collection('Users')
					.doc(user.uid)
					.set({
						email    : email,
						userName : userName,
						emailNotification: false,
                		pushNotification: false,
						loggedByGoogle: true
					})
					.then(function() {
						firebase.firestore().collection("Users").doc(user.uid).collection("Groups").doc("Admins").set({
							data: []
						})
						firebase.firestore().collection("Users").doc(user.uid).collection("Groups").doc("Members").set({
							data: []
						})
						setButtonDisabled(false);
					});
			})
			.catch(function(error) {
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				// The email of the user's account used.
				var email = error.email;
				// The firebase.auth.AuthCredential type that was used.
				var credential = error.credential;
				enqueueSnackbar('Wystąpił błąd', { variant: 'error' });
				setButtonDisabled(false);
				// ...
			});
	};

	const GoogleIcon = () => <img src="https://img.icons8.com/fluent/48/000000/google-logo.png" />;
	return (
		<LoginContainer>
			<MyInput type="email" id="fname" name="fname" placeholder="e-mail" onChange={(e) => setMail(e.target.value)} />
			<MyInput type="password" id="pname" name="pname" placeholder="hasło" onChange={(p) => setPassword(p.target.value)} />
			<MyLink2 to="/login/recover">Odzyskiwanie hasła</MyLink2>
			<EmptyBox>
				<FormControlLabel
					control={<Checkbox checked={state.checkedB} onChange={handleChange} name="checkedB" color="#73909C" />}
					label="Pamiętaj mnie"
				/>
			</EmptyBox>
			<Buttonscontainer>
				<Button
					color="#fff"
					type="contained"
					style={{
						width : '48%',
						color : 'black'
					}}
					text={
						<span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
							Zaloguj się {GoogleIcon()}
						</span>
					}
					onClick={gLogin}
					disabled={buttonDisabled}
				/>
				<Button
					color="#73909C"
					type="contained"
					style={{
						width : '48%',
						color : '#fff'
					}}
					text="Zaloguj się"
					onClick={login}
					disabled={buttonDisabled}
				/>
			</Buttonscontainer>

			<MyLink to="/login/reg">Jeśli nie masz konta, stwórz je</MyLink>
		</LoginContainer>
	);
}

const LoginContainer = styled.div`
	min-width: 417px;
	flex-direction: column;
	display: flex;
`;
const MyInput = styled.input`
	border: 2px solid #73909c;
	margin: 10px;
	font-family: 'Roboto', sans-serif;
	color: #73909c;
	font-size: 16px;
	border-radius: 10px;
	padding: 16px;
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
const EmptyBox = styled.div`
	margin: 10px;
	display: flex;
	flex-direction: row;
	color: #73909c;
`;
const Buttonscontainer = styled(EmptyBox)`
    flex-direction:row;
    justify-content: space-evenly;
    flex-grow: 0;
`;

const MyLink = styled(Link)`
color: ${(props) =>

		props.active ? '#738F9C' :
		'black'} ;
text-decoration: none; 
display: flex;
flex-direction: row;
align-content: center;
&:hover{color: #9C9083};
font-weight: bold;
font-size: 14px;
text-align:center;
align-items: center;
margin: 10px;
justify-content:center;
`;
const MyLink2 = styled(Link)`
text-decoration: none;
color:#738F9C; 
display: flex;
flex-direction: row;
&:hover{color: #9C9083};
font-weight: medium;
font-size: 14px;
justify-content:flex-end;
margin-right:12px;
`;
