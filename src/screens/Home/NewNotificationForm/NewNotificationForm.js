import React, { useState } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import DateFnsUtils from '@date-io/date-fns';
import { TimePicker, DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import Timer from '@material-ui/icons/Timer';
import Timelapse from '@material-ui/icons/Timelapse';
import { Button } from '../../../components';

export function NewNotificationForm() {
	const [ selectedDate, handleDateChange ] = useState(new Date());
	const [ selectedTime, handleTimeChange ] = useState(new Date());

	const autoGrowContentInput = (element) => {
		element.target.style.height = '30px';
		element.target.style.height = element.target.scrollHeight + 'px';
	};

	return (
		<FormContainer>
			<Container>
				<Typography variant="subtitle2">Utwórz przypomnienie</Typography>
				<ContentInput type="text" placeholder="O czym Ci przypomnieć?" onInput={autoGrowContentInput} />
				<TimePickersContainer>
					<span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
						<Timer style={{ marginRight: 5 }} />
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<DateTimePicker value={selectedDate} onChange={handleDateChange} showTodayButton disablePast ampm={false} color="primary" />
						</MuiPickersUtilsProvider>
					</span>
					<span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: 100, marginLeft: 15 }}>
						<Timelapse style={{ marginRight: 5 }} />
						<span style={{ marginRight: 5 }}>za</span>
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<TimePicker
								ampm={false}
								openTo="minutes"
								views={[ 'hours', 'minutes' ]}
								format="hh:mm"
								value={selectedTime}
								onChange={handleTimeChange}
							/>
						</MuiPickersUtilsProvider>
					</span>
				</TimePickersContainer>
			</Container>
			<ButtonsContainer>
				<Button
          color="#73909C"
					type="outlined"
					text="Wyczyść"
					style={{ marginRight: 10,width   : '100%',
          color   : '#73909C',
         }}
				/>
				<Button
          color="#73909C"
					type="contained"
					style={{
						width   : '100%',
						color   : '#fff',
					}}
					text="Zapisz"
				/>
			</ButtonsContainer>
		</FormContainer>
	);
}

const FormContainer = styled.div`
	grid-column: 2 / span 1;
	grid-row: 1 / span 4;
	display: flex;
	flex-direction: column;
	align-self: stretch;
`;

const Container = styled.div`
	background-color: #fffaf5;
	position: relative;
	padding: 15px;
	border-radius: 12px;
	font-size: 14px;
	color: rgba(0, 0, 0, .83);
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const ButtonsContainer = styled.div`
	display: flex;
	flex-direction: row;
	padding-top: 15px;
`;

const ContentInput = styled.textarea`
	outline: none;
	font-size: 14px;
	color: rgba(0, 0, 0, .83);
	width: 100%;
	border: none;
	margin-top: 10px;
	resize: none;
	font-family: 'Roboto';
	background-color: #fffaf5;
`;

const TimePickersContainer = styled(ButtonsContainer)`
  padding-top: 10px;
  justify-content: flex-start;
`;
