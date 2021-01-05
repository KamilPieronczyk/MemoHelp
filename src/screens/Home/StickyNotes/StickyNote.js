import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MoreIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';

export function StickyNote(props) {
	return (
		<Container>
			<Typography variant="subtitle2">{props.title}</Typography>
      		<Typography variant="body1">{props.content}</Typography>
			<MoreIconContainer>
				<MoreIcon />
			</MoreIconContainer>
		</Container>
	);
}
export function StickyNoteCreator(props) {
	return (
		<Container>
			<MyTextInput placeholder="Dodaj notatke" color='#9C9083'></MyTextInput>
			<MoreIconContainer>
				<AddIcon />
			</MoreIconContainer>
		</Container>
	);
}

const Container = styled.div`
	width: calc(100% / 2 - 10px);
	background-color: #fffaf5;
	border-radius: 12px;
	box-sizing: border-box;
	position: relative;
	padding: 25px;
	font-size: 14px;
	color: rgba(0, 0, 0, .83);
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  margin-top: 10px;
  margin-right: 15px;
`;

const MyTextInput=styled.textarea`
height: 100%;
width: 100%;
text-decoration:none;
border: none;
background:none;
outline:none;
color:#9C9083;
resize: vertical;
font-size:16px;



`;

const MoreIconContainer = withStyles((theme) => ({
	root : {
		position : 'absolute',
		top      : 0,
		right    : 0,
		color    : 'rgba(0,0,0,.83)'
	}
}))(IconButton);
