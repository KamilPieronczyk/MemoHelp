//import { Container } from '@material-ui/core'
//import React from 'react'
import styled from 'styled-components';
//import Checkbox from '@material-ui/core/Checkbox';
import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Button } from '../../components/index';
import Close from '@material-ui/icons/Close';
import CreateIcon from '@material-ui/icons/Create';
import firebase from 'firebase'

const GreenCheckbox = withStyles({
	root    : {
		color       : green[400],
		'&$checked' : {
			color : green[600]
		}
	},
	checked : {}
})((props) => <Checkbox color="default" {...props} />);

function UserAdminGroupsShowMembers(props) {

	if(props.groupDetails.size === 0) {
		return(
			<span></span>
		)
	}
	let groupId = props.groupDetails.id
	return(
		<div>
			{Array.from(props.groupDetails.users.keys()).map(key => {
				let id = props.groupDetails.users.get(key).id;
				let name = props.groupDetails.users.get(key).name;
				let surname = props.groupDetails.users.get(key).surname;
				let email = props.groupDetails.users.get(key).email;
				var text;
				if(name === undefined || surname === undefined)
					text = email
				else text = name + " " + surname
				return(
				<FlexboxItem key={id}>
					<RightButton id={id}>
						{text} <Close 
							onClick={() => props.fun(groupId, id)}
						/>
					</RightButton>
				</FlexboxItem>
				)
			})}
		</div>
	)
}

function UserGroupsShowMembers(props) {
	if(props.groupDetails.length !== 0) {
		return(
			<div>
				{props.groupDetails.users.map(person => {
					return(
						<FlexboxItem key={`${person.id}`}>
							<RightButton>{person.name} {person.surname}</RightButton>
						</FlexboxItem>
					)
				})}
			</div>
		)
	} else {
		return(
			<div></div>
		)
	}
}

export default function Groups() {
	
	let userAdminGroups = new Map();
	let userGroups = new Map();

	const getDataFromFirebase = () => {
		// TODO
		userAdminGroups.set("G0", {
			id: "G0",
			name: "Grupa0", 
			users: new Map()
		})
		userAdminGroups.get("G0").users.set("P0", {
			id: "P0",name: "Radek", surname: "Mo"
		})
		userAdminGroups.get("G0").users.set("P2", {
			id: "P2",name: "Kamil",surname: "Duda"
		})
		userAdminGroups.set("G1", {
			id: "G1",
			name: "Grupa1", 
			users: new Map()
		})
		userAdminGroups.get("G1").users.set("P1", {
			id: "P1",name: "Jan",surname: "Morawiecki"
		})
		userAdminGroups.get("G1").users.set("P2", {
			id: "P2",name: "Kamil",surname: "Duda"
		})
		userGroups.set("G2", {
			id: "G2",
			name: "Grupa2", 
			users: [
				{id: "P1",name: "Andrzej",surname: "Morawiecki"},
				{id: "P2",name: "Donald",surname: "Bieden"},
			]
		})
		userGroups.set("G3", {
			id: "G3",
			name: "Grupa3", 
			users: [
				{id: "P1",name: "Ja",surname: "Mo"},
				{id: "P2",name: "Ru",surname: "Sto"},
			]
		})
	}

	getDataFromFirebase();

	const [ state, setState ] = useState({
		checkedA : true,
		checkedB : true,
		checkedF : true,
		checkedG : true,
		userAdminGroupsView: userAdminGroups,
		userGroupsView: userGroups,
		userAdminGroupsMembersView: Array.from(userAdminGroups.keys()).length > 0 ? 
			userAdminGroups.get(Array.from(userAdminGroups.keys())[0]) : new Map(),
		userGroupsMembersView: Array.from(userGroups.keys()).length > 0 ? 
			userGroups.get(Array.from(userGroups.keys())[0]) : [],
		TMP_AdminGroupsUndoList: [],
		TMP_AdminDeleteGroups: [],
		TMP_LeftFromGroups: [],
		TMP_AdminGroupsNew: new Map(),
		TMP_AdminGroupsEditInfo: new Map(),
		TMP_AdminGroupsAddMembers: new Map(),
		TMP_AdminGroupsRemoveMembers: new Map(),

	});

	const removeUserFromGroupTemp = (groupId, personId) => {

		let user = state.userAdminGroupsView.get(groupId).users.get(personId)

		state.TMP_AdminGroupsUndoList.push({
			undo: () => {
				state.TMP_AdminGroupsRemoveMembers.get(groupId).users.pop();
				if(state.TMP_AdminGroupsRemoveMembers.get(groupId).users.length === 0)
				state.TMP_AdminGroupsRemoveMembers.delete(groupId);
				setState({...state, TMP_AdminGroupsRemoveMembers: state.TMP_AdminGroupsRemoveMembers});
				state.userAdminGroupsView.get(groupId).users.set(user.id, user);
				setState({...state, userAdminGroupsView: state.userAdminGroupsView});
				console.log(`Undo: remove user ${personId} from group ${groupId}`)
			}
		});
	
		setState({...state, userAdminGroupsView: 
			state.userAdminGroupsView.get(groupId).users.delete(personId)
		});
	
		if(state.TMP_AdminGroupsRemoveMembers.has(groupId))
			state.TMP_AdminGroupsRemoveMembers.get(groupId).users.push(personId);
		else {
			state.TMP_AdminGroupsRemoveMembers.set(groupId, {users: [personId]});
		}
	
		setState({...state, TMP_AdminGroupsRemoveMembers: state.TMP_AdminGroupsRemoveMembers});
		state.userAdminGroupsMembersView = state.userAdminGroupsView.get(groupId);
		setState({...state, userAdminGroupsMembersView: state.userAdminGroupsMembersView});

		console.log("state.TMP_AdminGroupsRemoveMembers");
		console.log(state.TMP_AdminGroupsRemoveMembers);
		console.log("state.TMP_AdminGroupsUndoList");
		console.log(state.TMP_AdminGroupsUndoList);
	}

	const btnAdminGroupsViewClick = id => {

		if(state.userAdminGroupsView.has(id) === false) return;

		if(Array.from(state.userAdminGroupsView.keys()).length > 0) {
			setState({ ...state, userAdminGroupsMembersView: state.userAdminGroupsView.get(id)});
		} else setState({ ...state, userAdminGroupsMembersView: []});
	};

	const btnOnlyMemberViewClick = id => {

		if(state.userGroupsView.has(id) === false) return;

		if(Array.from(state.userGroupsView.keys()).length) {
			setState({ ...state, userGroupsMembersView: state.userGroupsView.get(id)});
		} else setState({ ...state, userGroupsMembersView: []});
	};

	const addNewGroup = e => {
		if (e.key === 'Enter' && e.target.value != "") {
			
			let obj = {
				id: Math.random(),
				name: e.target.value,
				users: new Map()
			}

			state.userAdminGroupsView.set(obj.id, obj);
			state.TMP_AdminGroupsNew.set(obj.id, obj);
			setState({...state, TMP_AdminGroupsNew: state.TMP_AdminGroupsNew});

			// Define undo method
			state.TMP_AdminGroupsUndoList.push({
				undo: () => {
					let id = obj.id;
					state.TMP_AdminGroupsNew.delete(id);
					setState({...state, TMP_AdminGroupsNew: state.TMP_AdminGroupsNew});
					state.userAdminGroupsView.delete(id);
					setState({...state, userAdminGroupsView: state.userAdminGroupsView});
					console.log(`Undo: crete new group ${id}`)
				}
			});
			setState({ ...state, TMP_AdminGroupsUndoList: state.TMP_AdminGroupsUndoList});

			setState({...state, userAdminGroupsView: state.userAdminGroupsView});

			btnAdminGroupsViewClick(obj.id);
			e.target.value = "";

			console.log("state.TMP_AdminGroupsNew");
			console.log(state.TMP_AdminGroupsNew);
			console.log("state.TMP_AdminGroupsUndoList");
			console.log(state.TMP_AdminGroupsUndoList);
		}
	};

	const addNewMember = (e) => {
		if(state.userAdminGroupsMembersView.length === 0) {
			console.log("No group view")
			return;
		}
		if (e.key === 'Enter' && e.target.value !== "") {

			let groupId = state.userAdminGroupsMembersView.id; 
			let userData = {
				id: Math.random(),
				email: e.target.value,		
			}

			// TODO check email
			e.target.value = "";

			state.TMP_AdminGroupsUndoList.push({
				undo: () => {
					state.TMP_AdminGroupsAddMembers.get(groupId).users.pop();
					if(state.TMP_AdminGroupsAddMembers.get(groupId).users.length === 0)
						state.TMP_AdminGroupsAddMembers.delete(groupId)
					setState({...state, TMP_AdminGroupsAddMembers: state.TMP_AdminGroupsAddMembers});
					state.userAdminGroupsView.get(groupId).users.delete(userData.id);
					setState({...state, userAdminGroupsView: state.userAdminGroupsView});
					console.log(`Undo: add new member ${userData.id} to group: ${groupId}`)
				}
			});

			state.userAdminGroupsView.get(groupId).users.set(userData.id, userData);
			setState({...state, userAdminGroupsView: state.userAdminGroupsView});

			if(state.TMP_AdminGroupsAddMembers.has(groupId))
				state.TMP_AdminGroupsAddMembers.get(groupId).users.push(userData);
			else {
				state.TMP_AdminGroupsAddMembers.set(groupId, {users: [userData]});
			}
				

			setState({...state, TMP_AdminGroupsAddMembers: state.TMP_AdminGroupsAddMembers});
			state.userAdminGroupsMembersView = state.userAdminGroupsView.get(groupId);
			setState({...state, userAdminGroupsMembersView: state.userAdminGroupsMembersView});

			console.log("state.TMP_AdminGroupsAddMembers");
			console.log(state.TMP_AdminGroupsAddMembers);
			console.log("state.TMP_AdminGroupsUndoList");
			console.log(state.TMP_AdminGroupsUndoList);
		}
	};

	const leftFromGroup = id => {
		let group = userGroups.get(id);
		
		state.TMP_LeftFromGroups.push(group);
		setState({ ...state, TMP_LeftFromGroups: state.TMP_LeftFromGroups});
		
		state.userGroupsView.delete(id);
		
		if(Array.from(state.userGroupsView.keys()).length > 0) {
			setState({ ...state, userGroupsView: state.userGroupsView});
			setState({ ...state, userGroupsMembersView: state.userGroupsView.get(
				Array.from(state.userGroupsView.keys())[0]
			)});
		} else {
			setState({ ...state, userGroupsView: []});
			setState({ ...state, userGroupsMembersView: []});
		}

	}

	const editGroup = id => {
		let name = state.userAdminGroupsView.get(id).name;
		state.TMP_AdminGroupsUndoList.push({
			undo: () => {
				state.TMP_AdminGroupsEditInfo.delete(id);
				setState({...state, TMP_AdminGroupsEditInfo: state.TMP_AdminGroupsEditInfo});
				state.userAdminGroupsView.get(id).name = name;
				setState({...state, userAdminGroupsView: state.userAdminGroupsView});
				console.log(`Undo: edit group ${id}`)
			}
		});
		state.userAdminGroupsView.get(id).name = "Edit test";
		setState({...state, userAdminGroupsView: state.userAdminGroupsView});
		state.TMP_AdminGroupsEditInfo.set(id, state.userAdminGroupsView.get(id));
		setState({...state, TMP_AdminGroupsEditInfo: state.TMP_AdminGroupsEditInfo});

		console.log("state.TMP_AdminGroupsEditInfo");
		console.log(state.TMP_AdminGroupsEditInfo);
		console.log("state.TMP_AdminGroupsUndoList");
		console.log(state.TMP_AdminGroupsUndoList);
	};

	const undoAdminViewChange = () => {
		if(state.TMP_AdminGroupsUndoList.length > 0) {
			let obj = state.TMP_AdminGroupsUndoList.pop();
			setState({ ...state, TMP_AdminGroupsUndoList: state.TMP_AdminGroupsUndoList});
			obj.undo();
		}
	}

	const submitAdminViewChange = () => {
		console.log("state.TMP_AdminGroupsNew");
		console.log(state.TMP_AdminGroupsNew);
		console.log("state.TMP_AdminGroupsEditInfo");
		console.log(state.TMP_AdminGroupsEditInfo);
		console.log("state.TMP_AdminGroupsAddMembers");
		console.log(state.TMP_AdminGroupsAddMembers);
		console.log("state.TMP_AdminGroupsRemoveMembers");
		console.log(state.TMP_AdminGroupsRemoveMembers);
		state.TMP_AdminGroupsNew = new Map()
		setState({ ...state, TMP_AdminGroupsNew: state.TMP_AdminGroupsNew});
		state.TMP_AdminGroupsEditInfo = new Map();
		setState({ ...state, TMP_AdminGroupsEditInfo: state.TMP_AdminGroupsEditInfo});
		state.TMP_AdminGroupsAddMembers = new Map()
		setState({ ...state, TMP_AdminGroupsAddMembers: state.TMP_AdminGroupsAddMembers});
		state.TMP_AdminGroupsRemoveMembers = new Map()
		setState({ ...state, TMP_AdminGroupsRemoveMembers: state.TMP_AdminGroupsRemoveMembers});
		setState({ ...state, TMP_AdminGroupsUndoList: []});
	}

	const undoUserGroupsChange = () => {
		if(state.TMP_LeftFromGroups.length > 0) {
			let group = state.TMP_LeftFromGroups.pop();
			setState({ ...state, TMP_LeftFromGroups: state.TMP_LeftFromGroups});
			state.userGroupsView.set(group.id, group);
			setState({ ...state, userGroupsView: new Map([...state.userGroupsView.entries()].sort())});
		}
	}

	const submitUserGroupsChange = () => {
		console.log(state.TMP_LeftFromGroups);
		setState({ ...state, TMP_LeftFromGroups: []});
	}

	return (
		<FlexboxContainerContainer>
			{/* <Tytul>Memo helper</Tytul> */}
			<FlexboxContainer>
				<Flexhelper>
					<CreateGroupsTop />
					<CreateGroups>
						<CreateGroupsLeft>
							<div>Zarządzaj swoimi grupami</div>
							
							{/* <FlexboxItem>
								<LeftButtonZnajomi>
									Znajomi<CreateIcon />
								</LeftButtonZnajomi>
							</FlexboxItem> */}

							{Array.from(state.userAdminGroupsView.keys()).map(key => {
								let name = state.userAdminGroupsView.get(key).name;
								return(
									<FlexboxItem key={key} 
										onClick={() => btnAdminGroupsViewClick(key)}
									>
										<LeftButton>
											{name}<CreateIcon onClick={() => editGroup(key)}/>
										</LeftButton>
									</FlexboxItem>
								)
							})}

							<FlexboxItem>
								<AddButton>
									<MyTextInput maxLength="20" placeholder="Dodaj grupe" color="#9C9083" 
										onKeyDown={addNewGroup}
									/>{' '}
								</AddButton>
							</FlexboxItem>
						</CreateGroupsLeft>
						<CreateGroupsDivider />
						<CreateGroupsRight>
							{state.userAdminGroupsView.size > 0 &&
								<div>
									<div>Członkowie grupy: 
										<span style={{marginLeft: 5, textDecoration: 'underline'}}>{state.userAdminGroupsMembersView.name}</span>
									</div>
									<FlexboxItem>
										<RightButton>
											<MyTextInput maxLength="20" placeholder="Podaj email" color="#9C9083" 
												onKeyDown={addNewMember}
											/>{' '}
										</RightButton>
									</FlexboxItem>

									<UserAdminGroupsShowMembers 
										groupDetails={state.userAdminGroupsMembersView} 
										fun={removeUserFromGroupTemp} 
									/>
								</div>
							}
						</CreateGroupsRight>
					</CreateGroups>
					<CreateGroupsBottomRow>
						<FlexboxItem>
							<BottomRowBack>
								<Button
									text={'Cofnij'}
									color="#73909C"
									type="outlined"
									style={{
										color : '#73909C'
									}}
									onClick={undoAdminViewChange}
								/>
							</BottomRowBack>
						</FlexboxItem>
						<FlexboxItem>
							<BottomRowSetChanges>
								<Button
									text={'Zatwierdź zmiany'}
									color="#73909C"
									type="contained"
									style={{
										color : '#fff'
									}}
									onClick={submitAdminViewChange}
								/>
							</BottomRowSetChanges>
						</FlexboxItem>
					</CreateGroupsBottomRow>
				</Flexhelper>
				<Flexhelper>
					<CreateGroupsTop />
					<CreateGroups>
						<CreateGroupsLeft>
							<div>Twoje grupy</div>
							{/* <FlexboxItem>
								<LeftButtonZnajomi>
									Znajomi<Close />
								</LeftButtonZnajomi>
							</FlexboxItem> */}

							{Array.from(state.userGroupsView.keys()).map(key => {
								let name = state.userGroupsView.get(key).name
								return(
									<FlexboxItem key={key}
										onClick={() => btnOnlyMemberViewClick(key)} 
									>
										<LeftButton>
											{name}<Close onClick={() => leftFromGroup(key)}/>
										</LeftButton>
									</FlexboxItem> 
								)
							})}

						</CreateGroupsLeft>
						<CreateGroupsDivider />
						<CreateGroupsRight>
							{state.userGroupsMembersView.length === 0 &&
								<div>Nie należysz do żadnej grupy</div>
							}
							{state.userGroupsMembersView.length !== 0 &&
								<div>
									<div>Członkowie grupy: 
										<span style={{marginLeft: 5, textDecoration: 'underline'}}>{state.userGroupsMembersView.name}</span>
									</div>
									<UserGroupsShowMembers 
										groupDetails={state.userGroupsMembersView}
									/>
								</div>
							}
						</CreateGroupsRight>
					</CreateGroups>
					<CreateGroupsBottomRow>
						<FlexboxItem>
							<BottomRowBack>
								<Button
									text={'Cofnij'}
									color="#73909C"
									type="outlined"
									style={{
										color : '#73909C'
									}}
									onClick={undoUserGroupsChange}
								/>
							</BottomRowBack>
						</FlexboxItem>
						<FlexboxItem>
							<BottomRowSetChanges>
								<Button
									text={'Zatwierdź zmiany'}
									color="#73909C"
									type="contained"
									style={{
										color : '#fff'
									}}
									onClick={submitUserGroupsChange}
								/>
							</BottomRowSetChanges>
						</FlexboxItem>
					</CreateGroupsBottomRow>
				</Flexhelper>
			</FlexboxContainer>
		</FlexboxContainerContainer>
	);
}
const MyTextInput = styled.input`
	text-decoration: none;
	border: none;
	background: none;
	outline: none;
	color: #9c9083;
	font-size: 16px;
`;

const Flexhelper = styled.div`
	margin-bottom: 30px;
	flex-direction: row;
`;
const CreateGroups = styled.div`
	display: flex;

	background-color: #fffaf5;
	flex-direction: row;
	justify-content: space-between;
	align-items: stretch;
`;
const CreateGroupsTop = styled.div`
	min-height: 50px;
	background-color: #fffaf5;
`;
const CreateGroupsLeft = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	text-align: center;
	width: 100%;
	color: #9c9083;
`;
const LeftButton = styled.div`
	//min-width:100px;
	//width: 175px;
	display: flex;
	//flex-direction: row;
	justify-content: space-between;
	margin-top: 16px;
	min-height: 25px;
	margin-left: 50px;
	margin-right: 50px;
	border: 3px solid #9c9083;
	border-radius: 30px;
	padding: 14px;
	//align-self:center;
`;
const AddButton = styled.div`
	//min-width:100px;
	//width: 175px;
	display: flex;
	//flex-direction: row;
	justify-content: space-between;
	margin-top: 16px;
	min-height: 25px;
	margin-left: 50px;
	margin-right: 50px;
	border: 3px solid #9c9083;
	border-radius: 30px;
	padding: 14px;
	//align-self:center;
`;
const LeftButtonZnajomi = styled.div`
	//min-width:100px;
	display: flex;
	flex-direction: row;
	align-content: center;
	justify-content: space-between;
	text-align: center;
	width: 175px;
	margin-top: 16px;
	min-height: 25px;
	margin-left: 50px;
	margin-right: 50px;
	padding: 14px;
	background-color: #9c9083;
	border: 3px solid #9c9083;
	color: white;
	border-radius: 30px;
	//align-self:center;
`;
const LeftButton1 = styled.div`
	//width: 200px;
	//height: 50px;
	//border: 2px solid #73909C;
	background-color: #73909c;
	color: #ffffff;
	text-align: center;
	font-size: 16px;
	border-radius: 10px;
	padding: 16px;
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	//width:100%;
`;
const CreateGroupsRight = styled.div`
	display: flex;

	flex-direction: column;
	justify-content: space-around;
	width: 100%;
	color: #9c9083;
	text-align: center;
`;
const RightButton = styled.div`
	//min-width:100px;
	display: flex;
	flex-direction: row;
	align-content: center;
	justify-content: space-between;
	text-align: center;
	width: 175px;
	margin-top: 16px;
	min-height: 25px;
	margin-left: 50px;
	margin-right: 50px;
	padding: 14px;
	border: 3px solid #9c9083;
	border-radius: 12px;
	//align-self:center;
`;
const CreateGroupsDivider = styled.div`
	width: 2px;
	min-height: 100px;
	background-color: black;
`;
const CreateGroupsBottomRow = styled.div`
	min-width: 100px;
	min-height: 50px;
	display: flex;
	background-color: #fffaf5;
	justify-content: space-between;
`;

const FlexboxItem = styled.div`//background-color: #dfdfdf;`;
const BottomRowBack = styled.div`
	//min-width:100px;
	width: 175px;
	margin: 50px;
	min-height: 25px;
	margin-left: 50px;
	margin-right: 50px;

	//align-self:center;
`;
const BottomRowSetChanges = styled.div`
	width: 175px;
	margin: 50px;
	min-height: 25px;
	margin-left: 50px;
	margin-right: 50px;

	//align-self: center;
`;

const FlexboxMyGroups = styled.div`
	display: flex;
	background-color: #fffaf5;
	//justify-content: space-around;
	//align-items: center;
	//align-content: center;
	flex-direction: row;
`;
const FlexboxDivider = styled.div`
	display: flex;
	//justify-content: space-around;
	//align-items: center;
	//align-content: center;
	flex-direction: column;
`;
const FlexboxContainerContainer = styled.div`
	display: flex;
	//justify-content: space-around;
	//align-items: center;
	//align-content: center;
	flex-direction: column;
`;
const FlexboxContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;
	align-items: center;
	flex-direction: row;
`;

const Img = styled.img``;

const Box = styled.div`
	border: 2px solid #73909c;
	//min-height:50px;
	margin: 10px;
	font-family: 'Roboto', sans-serif;
	color: #73909c;
	font-size: 16px;
	border-radius: 10px;
	padding: 16px;
`;
const EmptyBox = styled.div`
	min-height: 50px;
	min-width: 417px;
	margin: 10px;
	display: flex;
	flex-direction: row;
	//text-align:center;
	color: #73909c;
`;

const Buttonscontainer = styled(EmptyBox)`
    flex-direction:row;
    //margin: 10px;
    justify-content: space-around;
`;
const MyInput = styled.input`
	border: 2px solid #73909c;
	//min-height:50px;
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
