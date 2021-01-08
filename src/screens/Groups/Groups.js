import styled from 'styled-components'
import React, { useState, useEffect } from 'react';
import {Button} from '../../components/index';
import Close from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete'
import {getUserAdminGroupsData, getUserGroupsData, firebaseAdminGroupsMapState, 
	firebaseLeftFromGroups} from './Firebase'
import {useSnackbar} from 'notistack'

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
				let userName = props.groupDetails.users.get(key).userName;
				let email = props.groupDetails.users.get(key).email;
				var text;
				if(userName === undefined)
					text = email
				else text = userName
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
}

export default function Groups() {
	
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	const [ state, setState ] = useState({
		checkedA : true,
		checkedB : true,
		checkedF : true,
		checkedG : true,
		load: false,
		userAdminGroupsView: new Map(),
		userGroupsView: new Map(),
		userAdminGroupsMembersView: new Map(),
		userGroupsMembersView: [],
		TMP_AdminGroupsUndoList: [],
		TMP_AdminDeleteGroups: new Map(),
		TMP_LeftFromGroups: [],
		TMP_AdminGroupsNew: new Map(),
		TMP_AdminGroupsEditInfo: new Map(),
		TMP_AdminGroupsAddMembers: new Map(),
		TMP_AdminGroupsRemoveMembers: new Map(),
	});

	useEffect(() => {
		if(state.load === false) {
			getUserAdminGroupsData().then(function(resultUserAdminGroupsView) {
				getUserGroupsData().then(function(resultUserGroupsView) {
					setState({
						...state,
						userAdminGroupsView: resultUserAdminGroupsView,
						userGroupsView: resultUserGroupsView,
						userAdminGroupsMembersView: Array.from(resultUserAdminGroupsView.keys()).length > 0 ? 
							resultUserAdminGroupsView.get(Array.from(resultUserAdminGroupsView.keys())[0]) : new Map(),
						userGroupsMembersView: Array.from(resultUserGroupsView.keys()).length > 0 ? 
							resultUserGroupsView.get(Array.from(resultUserGroupsView.keys())[0]) : {},
						load: true
					});
				});
			});
		}
	});

	const removeUserFromGroupTemp = (groupId, personId) => {

		let user = state.userAdminGroupsView.get(groupId).users.get(personId)

		state.TMP_AdminGroupsUndoList.push({
			undo: () => {
				state.TMP_AdminGroupsRemoveMembers.get(groupId).users.pop();
				if(state.TMP_AdminGroupsRemoveMembers.get(groupId).users.length === 0)
				state.TMP_AdminGroupsRemoveMembers.delete(groupId);
				state.userAdminGroupsView.get(groupId).users.set(user.id, user);
				setState({
					...state,
					userAdminGroupsView: state.userAdminGroupsView,
					TMP_AdminGroupsRemoveMembers: state.TMP_AdminGroupsRemoveMembers, 
				});
				console.log(`Undo: remove user ${personId} from group ${groupId}`)
			}
		});
	
		if(state.TMP_AdminGroupsRemoveMembers.has(groupId))
			state.TMP_AdminGroupsRemoveMembers.get(groupId).users.push(personId);
		else {
			state.TMP_AdminGroupsRemoveMembers.set(groupId, {users: [personId]});
		}
	
		state.userAdminGroupsMembersView = state.userAdminGroupsView.get(groupId);

		setState({
			...state,
			userAdminGroupsView: state.userAdminGroupsView.get(groupId).users.delete(personId),
			userAdminGroupsMembersView: state.userAdminGroupsMembersView,
			TMP_AdminGroupsRemoveMembers: state.TMP_AdminGroupsRemoveMembers,
		});
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

			state.TMP_AdminGroupsUndoList.push({
				undo: () => {
					state.TMP_AdminGroupsNew.delete(obj.id);
					state.userAdminGroupsView.delete(obj.id);
					setState({
						...state, 
						TMP_AdminGroupsNew: state.TMP_AdminGroupsNew, 
						userAdminGroupsView: state.userAdminGroupsView
					});
					console.log(`Undo: crete new group ${obj.id}`)
				}
			});

			setState({ 
				...state,
				userAdminGroupsView: state.userAdminGroupsView,
				TMP_AdminGroupsUndoList: state.TMP_AdminGroupsUndoList,
				TMP_AdminGroupsNew: state.TMP_AdminGroupsNew,
			});

			btnAdminGroupsViewClick(obj.id);
			e.target.value = "";
		}
	};

	const addNewMember = (e) => {
		if(state.userAdminGroupsMembersView.length === 0) return;

		if (e.key === 'Enter' && e.target.value !== "") {

			let groupId = state.userAdminGroupsMembersView.id; 
			let userData = {
				id: Math.random(),
				email: e.target.value,		
			}

			e.target.value = "";

			state.TMP_AdminGroupsUndoList.push({
				undo: () => {
					state.TMP_AdminGroupsAddMembers.get(groupId).users.pop();
					if(state.TMP_AdminGroupsAddMembers.get(groupId).users.length === 0)
						state.TMP_AdminGroupsAddMembers.delete(groupId)
					state.userAdminGroupsView.get(groupId).users.delete(userData.id);
					setState({
						...state, 
						TMP_AdminGroupsAddMembers: state.TMP_AdminGroupsAddMembers, 
						userAdminGroupsView: state.userAdminGroupsView
					});
					console.log(`Undo: add new member ${userData.id} to group: ${groupId}`)
				}
			});

			state.userAdminGroupsView.get(groupId).users.set(userData.id, userData);

			if(state.TMP_AdminGroupsAddMembers.has(groupId))
				state.TMP_AdminGroupsAddMembers.get(groupId).users.push(userData);
			else {
				let gName = state.userAdminGroupsMembersView.name;
				state.TMP_AdminGroupsAddMembers.set(groupId, {name: gName, users: [userData]});
			}
				
			state.userAdminGroupsMembersView = state.userAdminGroupsView.get(groupId);
			setState({
				...state,
				userAdminGroupsView: state.userAdminGroupsView,
				TMP_AdminGroupsAddMembers: state.TMP_AdminGroupsAddMembers,
				userAdminGroupsMembersView: state.userAdminGroupsMembersView
			});
		}
	};

	const leftFromGroup = id => {
		let group = state.userGroupsView.get(id);
		
		state.TMP_LeftFromGroups.push(group);
		setState({ ...state, TMP_LeftFromGroups: state.TMP_LeftFromGroups});
		
		state.userGroupsView.delete(id);
		
		if(Array.from(state.userGroupsView.keys()).length > 0) {
			setState({ ...state, userGroupsView: state.userGroupsView, userGroupsMembersView: state.userGroupsView.get(
				Array.from(state.userGroupsView.keys())[0]
			)});
		} else {
			setState({ ...state, userGroupsView: [], userGroupsMembersView: []});
		}

	}

	const editGroup = (e, id)=> {
		if (e.key === 'Enter' && e.target.value !== "") {
			let name = state.userAdminGroupsView.get(id).name;
			state.TMP_AdminGroupsUndoList.push({
				undo: () => {
					state.TMP_AdminGroupsEditInfo.delete(id);
					state.userAdminGroupsView.get(id).name = name;
					setState({
						...state,
						userAdminGroupsView: state.userAdminGroupsView,
						TMP_AdminGroupsEditInfo: state.TMP_AdminGroupsEditInfo,
					});
					console.log(`Undo: edit group ${id}`)
				}
			});
			state.userAdminGroupsView.get(id).name = e.target.value;
			state.TMP_AdminGroupsEditInfo.set(id, state.userAdminGroupsView.get(id));
			setState({
				...state,
				userAdminGroupsView: state.userAdminGroupsView,
				TMP_AdminGroupsEditInfo: state.TMP_AdminGroupsEditInfo
			});
		}
	};

	const deleteGroup = id => {
		let groupData = state.userAdminGroupsView.get(id);
		
		state.TMP_AdminGroupsUndoList.push({
			undo: () => {
				state.TMP_AdminDeleteGroups.delete(id);
				state.userAdminGroupsView.set(id, groupData);
				setState({
					...state,
					userAdminGroupsView: state.userAdminGroupsView,
					TMP_AdminDeleteGroups: state.TMP_AdminDeleteGroups,
				});
				console.log(`Undo: delete group ${id}`)
			}
		});

		state.TMP_AdminDeleteGroups.set(id, groupData);
		state.userAdminGroupsView.delete(id);

		setState({
			...state,
			userAdminGroupsView: state.userAdminGroupsView,
			TMP_AdminDeleteGroups: state.TMP_AdminDeleteGroups,
		});
	}

	const undoAdminViewChange = () => {
		if(state.TMP_AdminGroupsUndoList.length > 0) {
			let obj = state.TMP_AdminGroupsUndoList.pop();
			setState({
				...state,
				TMP_AdminGroupsUndoList: state.TMP_AdminGroupsUndoList
			});
			obj.undo();
		}
	}

	async function submitAdminViewChange() {

		let updates = await firebaseAdminGroupsMapState(
			state.TMP_AdminGroupsNew,
			state.TMP_AdminGroupsEditInfo,
			state.TMP_AdminGroupsAddMembers,
			state.TMP_AdminGroupsRemoveMembers,
			state.TMP_AdminDeleteGroups
			);
		
		if(updates.size > 0) {
			console.log("UPDATES", updates);
			if(updates.has("NEW-GROUPS-USERS-ID")){
				console.log("NEW-GROUPS-USERS-ID", updates.get("NEW-GROUPS-USERS-ID"));
				//New groups, update generated group id and users, if some 'user' have wrong email === null
				for(const [key, value] of updates.get("NEW-GROUPS-USERS-ID").entries()) {
					let randomGroupId = key;
					let firebaseGroupId = value.id;
					let groupName = state.userAdminGroupsView.get(randomGroupId).name;
					state.userAdminGroupsView.set(firebaseGroupId, {
						id: firebaseGroupId,
						name: groupName, 
						users: new Map()
					});
					state.userAdminGroupsView.delete(randomGroupId);
					// If user have email - not exists
					console.log("If email, err", value.users)
				}
			}

			if(updates.has("NEW-USERS-ID")) {
				console.log("NEW-USERS-ID", updates.get("NEW-USERS-ID"));
				for(const [key, value] of updates.get("NEW-USERS-ID").entries()) {
					let groupId = key;
					state.userAdminGroupsView.get(groupId).users = new Map();
					// If user have email - not exists
					console.log("If email, err", value.users)
				}
			}

			if(Array.from(state.userAdminGroupsView.keys()).length > 0) {
				state.userAdminGroupsMembersView = state.userAdminGroupsView.get(Array.from(state.userAdminGroupsView.keys())[0])
			} else state.userAdminGroupsMembersView = new Map();
		}

		state.TMP_AdminGroupsNew = new Map()
		state.TMP_AdminGroupsEditInfo = new Map();
		state.TMP_AdminGroupsAddMembers = new Map()
		state.TMP_AdminGroupsRemoveMembers = new Map()
		state.TMP_AdminDeleteGroups = new Map();

		setState({ 
			...state,
			userAdminGroupsView: state.userAdminGroupsView,
			userAdminGroupsMembersView: state.userAdminGroupsMembersView,
			TMP_AdminGroupsEditInfo: state.TMP_AdminGroupsEditInfo,
			TMP_AdminGroupsAddMembers: state.TMP_AdminGroupsAddMembers,
			TMP_AdminGroupsRemoveMembers: state.TMP_AdminGroupsRemoveMembers,
			TMP_AdminGroupsUndoList: [],
			TMP_AdminGroupsNew: state.TMP_AdminGroupsNew,
			TMP_AdminDeleteGroups: state.TMP_AdminDeleteGroups
		});

		enqueueSnackbar('Operacja została wykonana pomyślnie', { variant: 'success' })
	}

	const undoUserGroupsChange = () => {
		if(state.TMP_LeftFromGroups.length > 0) {
			let group = state.TMP_LeftFromGroups.pop();
			setState({ ...state, TMP_LeftFromGroups: state.TMP_LeftFromGroups});
			state.userGroupsView.set(group.id, group);
			setState({ ...state, userGroupsView: new Map([...state.userGroupsView.entries()].sort())});
		}
	}

	async function submitUserGroupsChange() {
		await firebaseLeftFromGroups(state.TMP_LeftFromGroups)
		enqueueSnackbar('Operacja została wykonana pomyślnie', { variant: 'success' })
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
							
							{state.userAdminGroupsView.size > 0 &&
								Array.from(state.userAdminGroupsView.keys()).map(key => {
									if(key !== "Friends") {
										let name = state.userAdminGroupsView.get(key).name;
										return(
											<FlexboxItem key={key} 
												onClick={() => btnAdminGroupsViewClick(key)}
											>
												<LeftButton>
													<MyTextInput2 maxLength="20" placeholder={name} color="#9C9083" 
														onKeyDown={(e) => editGroup(e, key)}
													/>
													<DeleteIcon onClick={() => deleteGroup(key)}/>
												</LeftButton>
											</FlexboxItem>
										)
									} else {
										return(
											<FlexboxItem key={key} 
												onClick={() => btnAdminGroupsViewClick(key)}>
												<LeftButtonZnajomi>Znajomi</LeftButtonZnajomi>
											</FlexboxItem>
										)
									}
								})
							}
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

							{state.userGroupsView.size > 0 &&
								Array.from(state.userGroupsView.keys()).map(key => {
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
								})
							}

						</CreateGroupsLeft>
						<CreateGroupsDivider />
						<CreateGroupsRight>
							{Object.keys(state.userGroupsMembersView).length <= 0 &&
								<div>Nie należysz do żadnej grupy</div>
							}
							{Object.keys(state.userGroupsMembersView).length > 0 &&
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
const MyTextInput2 = styled.input`
	text-decoration: none;
	border: none;
	background: none;
	outline: none;
	color: #9c9083;
	font-size: 16px;
	width: 50%;
	opacity: 1;
`;

const MyTextInput = styled.input`
	text-decoration: none;
	border: none;
	background: none;
	outline: none;
	color: #9c9083;
	font-size: 16px;
`;

const Flexhelper=styled.div`
margin-bottom: 30px;
flex-direction: row;

`
const CreateGroups = styled.div`
	display: flex;
	background-color: #fffaf5;
	flex-direction: row;
	justify-content: space-between;
	align-items: stretch;
`;
const CreateGroupsTop = styled.div`
    min-height:50px;
    background-color: #FFFAF5;
`
const CreateGroupsLeft = styled.div`
display:flex;
flex-direction:column;
justify-content:space-around;
text-align:center;
width:100%;
color:#9C9083;
`
const LeftButton=styled.div`
    //min-width:100px;
    //width: 175px; 
    display: flex;
//flex-direction: row;
justify-content:space-between;
    margin-top:16px;
    min-height: 25px;
    margin-left:50px;
    margin-right:50px;
    border: 3px solid #9C9083;
    border-radius: 30px;
    padding:14px;
    //align-self:center;
`
const AddButton=styled.div`
    //min-width:100px;
    //width: 175px; 
    display: flex;
    //flex-direction: row;
    justify-content:space-between;
    margin-top:16px;
    min-height: 25px;
    margin-left:50px;
    margin-right:50px;
    border: 3px solid #9C9083;
    border-radius: 30px;
    padding:14px;
    //align-self:center;
`
const LeftButtonZnajomi=styled.div`
    //min-width:100px;
    display: flex;
flex-direction: row;
align-content: center;
justify-content:space-between;
    text-align:center;
    width: 175px; 
    margin-top:16px;
    min-height: 25px;
    margin-left:50px;
    margin-right:50px;
    padding:14px;
    background-color: #9C9083;
    border: 3px solid #9C9083;
    color:white;
    border-radius: 30px;
    //align-self:center;
`
const LeftButton1=styled.div`
    //width: 200px;
    //height: 50px;
    //border: 2px solid #73909C;
    background-color: #73909C;
    color: #FFFFFF;
    text-align: center;
    font-size: 16px;
    border-radius: 10px;
    padding: 16px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    //width:100%;
`
const CreateGroupsRight = styled.div`
display:flex;

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
min-height:100px;
    background-color: black;
`
const CreateGroupsBottomRow = styled.div`
    min-width: 100px;
    min-height:50px;
    display: flex;
    background-color: #FFFAF5;
    justify-content: space-between;
    
`


const FlexboxItem=styled.div`

    //background-color: #dfdfdf;
`
const BottomRowBack=styled.div`
    //min-width:100px;
    width: 175px; 
    margin: 50px;
    min-height: 25px;
    margin-left:50px;
    margin-right:50px;

    //align-self:center;
`
const BottomRowSetChanges=styled.div`
    width: 175px; 
    margin: 50px;
    min-height: 25px;
    margin-left:50px;
    margin-right:50px;

    //align-self: center;
`

const FlexboxMyGroups = styled.div`
    display: flex;
    background-color: #FFFAF5;
    //justify-content: space-around;
    //align-items: center;
    //align-content: center;
    flex-direction: row;
`
const FlexboxDivider = styled.div`
    display: flex;
    //justify-content: space-around;
    //align-items: center;
    //align-content: center;
    flex-direction: column;
`
const FlexboxContainerContainer = styled.div`
    display: flex;
    //justify-content: space-around;
    //align-items: center;
    //align-content: center;
    flex-direction: column;
`
const FlexboxContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content:space-around;
    align-items:center;
    flex-direction: row;
`

const Img=styled.img`
`

const Box=styled.div`
    border: 2px solid #73909C;
    //min-height:50px;
    margin: 10px;
    font-family: 'Roboto', sans-serif;
    color: #73909C;
    font-size: 16px;
    border-radius: 10px;
    padding: 16px;
`
const EmptyBox=styled.div`
    min-height:50px;
    min-width:417px;
    margin: 10px;
    display: flex;
    flex-direction: row;
    //text-align:center;
    color: #73909C;
`

const Buttonscontainer=styled(EmptyBox)`
    flex-direction:row;
    //margin: 10px;
    justify-content: space-around;
`
const MyInput = styled.input`
    border: 2px solid #73909C;
    //min-height:50px;
    margin: 10px;
    font-family: 'Roboto', sans-serif;
    color: #73909C;
    font-size: 16px;
    border-radius: 10px;
    padding: 16px;
    background-color: transparent;
    &:focus {
        border-radius: 10px;
        border-color: #73909C;
        outline: none;
    }
    &:active {
        border-radius: 10px;
        border-color: #73909C;
        outline: none;
    }
`