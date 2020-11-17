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

function AdminGroupsView(props) {

	const removeUserFromGroupTemp = e => {
		console.log(`removeUserFromGroupTemp`);
		console.group(e);
	}

	return(
		<div>
			{props.users.map(person => {
				return(
				<FlexboxItem key={person.id}>
					<RightButton id={person.id}>
						{person.name} {person.surname}<Close 
							onClick={() => removeUserFromGroupTemp(person.id)}
						/>
					</RightButton>
				</FlexboxItem>
				)
			})}
		</div>
	)
}

function OnlyMembersView(props) {
	return(
		<div>
			{props.users.map(person => {
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

	let dataFromFirebase = {
		adminGroups: [
			{
				id: "G0",
				name: "Grupa0", 
				users: [
					{id: "P0",name: "Radek",surname: "Mo"},
					{id: "P2",name: "Kamil",surname: "Duda"}
				]
			},
			{
				id: "G1",
				name: "Grupa1", 
				users: [
					{id: "P1",name: "Jan",surname: "Morawiecki"},
					{id: "P2",name: "Kamil",surname: "Duda"}
				]
			}
		],
		onlyMember: [
			{
				id: "G2",
				name: "Grupa2", 
				users: [
					{id: "P1",name: "Andrzej",surname: "Morawiecki"},
					{id: "P2",name: "Donald",surname: "Bieden"},
				]
			},
			{
				id: "G3",
				name: "Grupa3", 
				users: [
					{id: "P1",name: "Ja",surname: "Mo"},
					{id: "P2",name: "Ru",surname: "Sto"},
				]
			}
		]
	}

	const [ state, setState ] = useState({
		checkedA : true,
		checkedB : true,
		checkedF : true,
		checkedG : true,
		AdminMembersArr: dataFromFirebase.adminGroups[0].users,
		BelongsMembersArr: dataFromFirebase.onlyMember[0].users
	});

	const btnAdminGroupsViewClick = id => {
		console.log(`btnAdminGroupsViewClick: ${id}`);
		for(let i = 0; i < dataFromFirebase.adminGroups.length; i++) {
			if(dataFromFirebase.adminGroups[i].id == id) {
				setState({ ...state, AdminMembersArr: dataFromFirebase.adminGroups[i].users});
				break;
			}
		}
	};

	const btnOnlyMemberViewClick = id => {
		for(let i = 0; i < dataFromFirebase.onlyMember.length; i++) {
			if(dataFromFirebase.onlyMember[i].id == id) {
				setState({ ...state, BelongsMembersArr: dataFromFirebase.onlyMember[i].users});
				break;
			}
		}
	};

	const addNewGroupToTemp = e => {
		if (e.key === 'Enter') {
			dataFromFirebase.adminGroups.push(
				{
					id: e.target.value,
					name: e.target.value,
					users: []
				}
			)
			console.log(dataFromFirebase.adminGroups);
		}
	};

	const addNewMemberToTemp = (e, groupId, name) => {
		if (e.key === 'Enter') {
			console.log("addNewMemberToTemp");	
			console.log(groupId, name);
		}
	};

	const leftFromGroupTemp = id => {
		console.log(`leftFromGroupTemp`);
		console.log(id);
	}

	const editGroupTemp = id => {
		console.log(`editGroupTemp`);
		console.log(id);
	};

	const undoAdminViewChange = () => {
		console.log(`undoAdminViewChange`);
	}

	const submitAdminViewChange = () => {
		console.log(`submitAdminViewChange`);
	}

	const undoOnlyMemberChange = () => {
		console.log(`undoOnlyMemberChange`);
	}

	const submitOnlyMemberViewChange = () => {
		console.log(`submitOnlyMemberViewChange`);
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

							{dataFromFirebase.adminGroups.map(item => {
								return(
									<FlexboxItem key={item.id} 
										onClick={() => btnAdminGroupsViewClick(item.id)}
									>
										<LeftButton>
											{item.name}<CreateIcon onClick={() => editGroupTemp(item.id)}/>
										</LeftButton>
									</FlexboxItem>
								)
							})}

							<FlexboxItem>
								<AddButton>
									<MyTextInput maxLength="20" placeholder="Dodaj grupe" color="#9C9083" 
										onKeyDown={addNewGroupToTemp}
									/>{' '}
								</AddButton>
							</FlexboxItem>
						</CreateGroupsLeft>
						<CreateGroupsDivider />
						<CreateGroupsRight>
							<FlexboxItem>
								<RightButton>
									<MyTextInput maxLength="20" placeholder="Podaj email" color="#9C9083" 
										onKeyDown={addNewMemberToTemp}
									/>{' '}
								</RightButton>
							</FlexboxItem>

						<AdminGroupsView users={state.AdminMembersArr} />

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


							{dataFromFirebase.onlyMember.map(item => {
								return(
									<FlexboxItem key={item.id}
										onClick={() => btnOnlyMemberViewClick(item.id)} 
									>
										<LeftButton>
											{item.name}<Close onClick={() => leftFromGroupTemp(item.id)}/>
										</LeftButton>
									</FlexboxItem> 
								)
							})}

						</CreateGroupsLeft>
						<CreateGroupsDivider />
						<CreateGroupsRight>
							
							<OnlyMembersView users={state.BelongsMembersArr}/>

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
									onClick={undoOnlyMemberChange}
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
									onClick={submitOnlyMemberViewChange}
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
