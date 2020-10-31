import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MoreIcon from '@material-ui/icons/MoreVert';
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

const Container = styled.div`
	width: calc(100% / 2 - 10px);
	background-color: #fffaf5;
	border-radius: 12px;
	box-sizing: border-box;
	position: relative;
	padding: 15px;
	font-size: 14px;
	color: rgba(0, 0, 0, .83);
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  margin-top: 10px;
  margin-right: 15px;
`;

const MoreIconContainer = withStyles((theme) => ({
	root : {
		position : 'absolute',
		top      : 0,
		right    : 0,
		color    : 'rgba(0,0,0,.83)'
	}
}))(IconButton);
