import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import DateFnsUtils from '@date-io/date-fns';
import { TimePicker, DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import Timer from '@material-ui/icons/Timer';
import Timelapse from '@material-ui/icons/Timelapse';
import { Button } from '../../../components';
import { Collapse } from '@material-ui/core';
import RadioForm from './RadioForm'
import Checkbox from '@material-ui/core/Checkbox';
import {CheckBoxButton} from './CheckBoxButton'
import {CollapseButton} from './CollapseButton'
import {makeStyles} from '@material-ui/core';
import {useRecoilState, useRecoilValue} from 'recoil'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Reminder, textContentState, dateState, timeState, weekDaysState, frequencyState, typeState, getAllGroups } from '../../../utils/FirebaseReminders'
import {useSnackbar} from 'notistack'
import {isFormOpened} from '../Home'

const daysNumbers = {'mon': 1, 'thi': 2, 'wed': 3, 'thu': 4, 'fri': 5, 'sat': 6, 'sun': 7}

const useStyles = makeStyles((theme) => ({
		openedContainer: {
			gridColumn: 'span 2'
		},
		noOpenedContainer: {
			gridColumn: 'span 1'
		},
		firstColumn: {
			flex: 1
		},
		collapsedSecondColumn: {
			flex: 0,
			display: 'none'
		},
		noCollapsedSecondColumn: {
			flex: 1
		},
		errorTextInput: {
			border: '1px solid red',
			borderRadius: '10px'
		},
		successTextInput: {
			borderBottom: '2px #73909C solid'
		},
		opacity100: {
			opacity: 1
		},
		opacity40: {
			opacity: .4
		}
}));

export function NewNotificationForm() {
	const styles = useStyles();
	const [selectedDate, handleDateChange] = useRecoilState(dateState);
	const [selectedTime, handleTimeChange] = useRecoilState(timeState);
	const [isFormOpenedState, setIsFormOpenedState] = useRecoilState(isFormOpened);
	const [textContent, handleTextChange] = useRecoilState(textContentState);
	const [weekDaysArr, setWeekDaysArr] = useRecoilState(weekDaysState)
	const [frequency, setFrequency] = useRecoilState(frequencyState)
  const [type, setType] = useRecoilState(typeState);
	const [showMoreSettings, setShowMoreSettings] = useState(false);
	const [textInputState, setTextInputState] = useState(true);
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const [datePickerVersion, setDatePickerVersion] = useState(true)
	const [buttonDisabled, setButtonDisabled] = useState(false)
	const [groupsData, setGroupData] = useState(new Map())
	const [load, setLoad ] = useState(true)
	
	useEffect(() => {
		if(load === true) {
			getAllGroups().then(async function(data) {
				setGroupData(data);
				setLoad(false);
			});
		} else console.log("STATE GROUP_DATA", groupsData);
	});


	const autoGrowContentInput = (element) => {
		console.log(textContent);
		handleTextChange(element.target.value);
		element.target.style.height = '30px';
		element.target.style.height = element.target.scrollHeight + 'px';
	};
	var reminder = new Reminder();

	const toggleMoreSettings = () => {
		setShowMoreSettings(state => !state);
		setIsFormOpenedState(state => !state)
		if(showMoreSettings){
			setType(Reminder.reminderTypes.default)
		}
	}

	reminder.textContent = textContent;
	let date = useRecoilValue(dateState);
	let time = useRecoilValue(timeState);
	time = Date.now() + (time.getTime() - (new Date()).setHours(0,0,0,0))
	time = new Date(time)
	reminder.date = datePickerVersion ? date : time;
	reminder.frequency = frequency;
	reminder.type = type
	const days = useRecoilValue(weekDaysState);
	reminder.weekDays = days;

	const pushToFirestore = () => {

		if(!validateTextInput()) return
		if(!validateDate()) return

		let sendToGroupReminder = false;
		setButtonDisabled(true)

		for(const [key, value] of groupsData.entries()) {
			console.log("TRU", value);
			if(value.selected) {
				reminder.SendReminderToGroupCollection(key).then(()=>{
					enqueueSnackbar(`Powiadomienie zostało dodane dla grupy ${value.name}`, {variant: 'success'})
				}).catch(()=>{
					enqueueSnackbar('Wystąpił problem z dodaniem przypomnienia', {variant: 'error'})
				})
				sendToGroupReminder = true;
			}
		}

		if(sendToGroupReminder == false) {
			reminder.SendReminderToUserCollection().then(()=>{
				enqueueSnackbar('Powiadomienie zostało dodane', {variant: 'success'})
				clearForm()
				setButtonDisabled(false)
			}).catch(()=>{
				enqueueSnackbar('Wystąpił problem z dodaniem przypomnienia', {variant: 'error'})
				setButtonDisabled(false)
			})
			console.log("Send to reminder");
		} else {
			clearForm()
			setButtonDisabled(false)
			console.log("Send to groups reminder collections");
		}

	}

	const validateTextInput = () => {
		if(textContent == ""){
			setTextInputState(false)
			enqueueSnackbar('Treść przypomnienia nie może być pusta', {variant: 'error'})
			return false
		}
		return true
	}

	const validateDate = () => {
		let date = new Date(selectedDate)
		let time = new Date(selectedTime)
		if(datePickerVersion && date.getTime() < Date.now() && type != Reminder.reminderTypes.special){
			enqueueSnackbar('Data nie może odnosić się do przeszłości', {variant: 'error'})
			return false
		}
		prepareDate()
		return true
	}

	const prepareDate = () => {
		if(type != Reminder.reminderTypes.special) return;
		let date = new Date(selectedDate)
		for (let i = 0; i < weekDaysArr.length; i++) {
			if(date.getDay() == daysNumbers[weekDaysArr[i]]){
				if(date.getTime() < Date.now()) {
					date.setDate(date.getDate() + 7)
					reminder.date = datePickerVersion ? date : time;
					handleDateChange(date)
				}
				return;
			}
		}
		date.setDate(date.getDate() + 1)
		for (let i = 0; i < 6; i++) {
			let exists = weekDaysArr.find(day => date.getDay() == daysNumbers[day])
			if(exists != undefined) break;
			date.setDate(date.getDate() + 1)
		}
		reminder.date = datePickerVersion ? date : time;
		handleDateChange(date)
	}

	async function clearForm() {
		handleTextChange("")
		setTextInputState(true)
		setWeekDaysArr(new Array())
		setFrequency(null)
		setType(Reminder.reminderTypes.default)
	}

	return (
		<FormContainer className={showMoreSettings ? styles.openedContainer : styles.noOpenedContainer}>
			<Container>
				<div className={styles.firstColumn}>
					<Typography variant="subtitle2">Utwórz przypomnienie</Typography>
					<ContentInput value={textContent} type="text" className={textInputState ? styles.successTextInput : styles.errorTextInput} placeholder="O czym Ci przypomnieć?" onInput={autoGrowContentInput} onChange={e => {handleTextChange(e.target.value); setTextInputState(true)}} />
					<TimePickersContainer>
						<span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} onClick={()=>setDatePickerVersion(true)} className={datePickerVersion ? styles.opacity100 : styles.opacity40}>
							<Timer style={{ marginRight: 5 }} />
							<MuiPickersUtilsProvider utils={DateFnsUtils}>
								{
									type != Reminder.reminderTypes.special ?
										<DateTimePicker  value={selectedDate}  onChange={handleDateChange} showTodayButton disablePast ampm={false} color="primary" />
										:
										<TimePicker
											ampm={false}
											openTo="minutes"
											views={['hours', 'minutes']}
											format="hh:mm"
											value={selectedDate}
											onChange={handleDateChange}
										/>
								}
							</MuiPickersUtilsProvider>
						</span>
						<span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: 100, marginLeft: 15 }} className={datePickerVersion ? styles.opacity40 : styles.opacity100} onClick={()=>setDatePickerVersion(false)}>
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
						Wybierz grupę: 
						<GroupsContainer>
							{ groupsData.size > 0 &&
								Array.from(groupsData.keys()).map(key => {
									return(
										<FormControlLabel
											control={
												<Checkbox
													checked={groupsData.get(key).seleced}
													onChange={() => {
														groupsData.get(key).selected = !groupsData.get(key).selected
														setGroupData(groupsData);
													}}
													name="checkedB"
													color="primary"
												/>
											}
											label={groupsData.get(key).name}
										/>
									)
								})
							}
							{
								groupsData.size <= 0 &&
									<span> nie należysz do żadnych grup</span>
							}
						</GroupsContainer>
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
						onClick={clearForm}
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
						disabled={buttonDisabled}
					/>
				</div>
				<div className={showMoreSettings ? styles.noCollapsedSecondColumn : styles.collapsedSecondColumn}></div>
			</ButtonsContainer>
		</FormContainer>
	);
}

const GroupsContainer = styled.div`
	padding: 15px;
`;

const FormContainer = styled.div`
	//grid-row: span 4;
  min-height: 400px;
	display: flex;
	flex-direction: column;
	align-self: stretch;
	z-index: 1;
`;

const Container = styled.div`
	background-color: #ccc;
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
	border-bottom: '1px #73909C solid'
`;

const TimePickersContainer = styled(ButtonsContainer)`
  padding-top: 10px;
  justify-content: flex-start;
`;
