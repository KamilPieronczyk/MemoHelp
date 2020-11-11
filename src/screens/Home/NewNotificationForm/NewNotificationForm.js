import React, { useState } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import DateFnsUtils from '@date-io/date-fns';
import { TimePicker, DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import Timer from '@material-ui/icons/Timer';
import Timelapse from '@material-ui/icons/Timelapse';
import { Button } from '../../../components';
import { Collapse } from '@material-ui/core';
import RadioForm from './RadioForm'
import {CheckBoxButton} from './CheckBoxButton'
import {CollapseButton} from './CollapseButton'
import {makeStyles} from '@material-ui/core';
import {useRecoilState, useRecoilValue} from 'recoil'
import { Reminder, textContentState, dateState, timeState, weekDaysState, frequencyState } from '../../../utils/FirebaseReminders'

const useStyles = makeStyles((theme) => ({
		openedContainer: {
			gridColumn: '2 / 4'
		},
		noOpenedContainer: {
			gridColumn: '2 / 3'
		},
		firstColumn: {
			flex: 1
		},
		collapsedSecondColumn: {
			flex: 0
		},
		noCollapsedSecondColumn: {
			flex: 1
		}

}));

export function NewNotificationForm() {
	const styles = useStyles();
	const [selectedDate, handleDateChange] = useRecoilState(dateState);
	const [selectedTime, handleTimeChange] = useRecoilState(timeState);
	const [textContent, handleTextChange] = useRecoilState(textContentState);
	const [showMoreSettings, setShowMoreSettings] = useState(true);

	const autoGrowContentInput = (element) => {
		console.log(textContent);
		handleTextChange(element.target.value);
		element.target.style.height = '30px';
		element.target.style.height = element.target.scrollHeight + 'px';
	};

	const toggleMoreSettings = () => {
		setShowMoreSettings(state => !state);

	}

	var reminder = new Reminder();
		reminder.textContent = textContent;
		reminder.date = useRecoilValue(dateState);
		reminder.time = useRecoilValue(timeState);
		reminder.frequency = useRecoilValue(frequencyState);
		const days = useRecoilValue(weekDaysState);
		reminder.weekDays = days;

	const pushToFirestore = () => {
		reminder.SendReminderToUserCollection();
	}

	return (
		<FormContainer className={showMoreSettings ? styles.openedContainer : styles.noOpenedContainer}>
			<Container>
				<div className={styles.firstColumn}>
					<Typography variant="subtitle2">Utwórz przypomnienie</Typography>
					<ContentInput type="text" placeholder="O czym Ci przypomnieć?" onInput={autoGrowContentInput} onChange={e => handleTextChange(e.target.value)} />
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
									views={['hours', 'minutes']}
									format="hh:mm"
									value={selectedTime}
									onChange={handleTimeChange}
								/>
							</MuiPickersUtilsProvider>
						</span>
					</TimePickersContainer>

					<Collapse in={showMoreSettings} timeout={"auto"}>
						<Typography variant={"subtitle2"} style={{ marginTop: 20 }}>
							Powtarzaj
						</Typography>
						<RadioForm />
						<CheckBoxButton />
					</Collapse>
					<CollapseButton expanded={showMoreSettings} onClick={toggleMoreSettings} />

				</div>
				<div className={showMoreSettings ? styles.noCollapsedSecondColumn : styles.collapsedSecondColumn}>
					<Collapse in={showMoreSettings} timeout={"auto"}>
						elo
					</Collapse>
				</div>

			</Container>
			<ButtonsContainer>
				<div className={styles.firstColumn} style={{display: 'flex', flexDirection: 'row'}}>
					<Button
						color="#73909C"
						type="outlined"
						text="Wyczyść"
						style={{
							marginRight: 10, width: '100%',
							color: '#73909C',
						}}
						onClick={toggleMoreSettings}
					/>
					<Button
						color="#73909C"
						type="contained"
						style={{
							width: '100%',
							color: '#fff',
						}}
						text="Zapisz"
						onClick={pushToFirestore}
					/>
				</div>
				<div className={showMoreSettings ? styles.noCollapsedSecondColumn : styles.collapsedSecondColumn}></div>
			</ButtonsContainer>
		</FormContainer>
	);
}

const FormContainer = styled.div`
	grid-row: 1 / span 4;
	display: flex;
	flex-direction: column;
	align-self: stretch;
	z-index: 1;
`;

const Container = styled.div`
	background-color: #fffaf5;
	position: relative;
	padding: 15px;
	border-radius: 12px;
	font-size: 14px;
	color: rgba(0, 0, 0, .83);
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	display: flex;
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
