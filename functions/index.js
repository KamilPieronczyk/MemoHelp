const admin = require('firebase-admin');
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });
const { v2beta3 } = require("@google-cloud/tasks");

admin.initializeApp();
const client = new v2beta3.CloudTasksClient();

exports.triggerReminder = functions.firestore
    .document('Users/{userId}/Reminders/{reminderId}')
    .onCreate(async (snap, context) => {
        const serviceAccountEmail = "memohelp@appspot.gserviceaccount.com";
        const project = "memohelp";
        const queue = "reminders";
        const location = "europe-west1";
        const url =
            "https://us-central1-memohelp.cloudfunctions.net/handleReminderAction";
        const payload = {
            userId: context.params.userId,
            reminderId: context.params.reminderId
        };
        const formattedParent = client.queuePath(project, location, queue);
        const time = snap.data().date;

        const task = {
            scheduleTime: time,
            httpRequest: {
                httpMethod: "POST",
                url: url,
                body: Buffer.from(JSON.stringify(payload)).toString("base64"),
                headers: {
                    "Content-Type": "application/json"
                },
                oidcToken: {
                    serviceAccountEmail
                }
            }
        };
        console.log("Sending task:");
        console.log(task);
        const request = {
            parent: formattedParent,
            task: task
        };
        const [response] = await client.createTask(request);
        snap.ref.update({ ...snap.data(), taskId: response.name })
        console.log(`Created task ${response.name}`);

        return 0;
    });

let transporter = nodemailer.createTransport({
    host: "smtp.mailgun.org",
    port: 587,
    auth: {
        user: functions.config().mailgun.user,
        pass: functions.config().mailgun.password
    }
});


exports.handleReminderAction = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        //sendMail(req.query.dest, req.query.title, req.query.message);
        const userId = req.body.userId;
        const reminderId = req.body.reminderId;

        const user = await admin.firestore().doc(`Users/${userId}`).get();
        const userMail = await user.data().email;

        const reminder = await admin.firestore().doc(`Users/${userId}/Reminders/${reminderId}`).get();
        const subject = 'Memohelper przypomnienie';
        const message = await reminder.data().text;
        
        console.log("Checking email notification permission: " + user.data().emailNotification );
        if(user.data().emailNotification == undefined || user.data().emailNotification){
            await sendMail(userMail, subject, message, res);
        }
            

        const userToken = user.data().token;
        if (userToken != undefined) {
            console.log("Checking push notification permission: " + user.data().pushNotification );
            if(user.data().pushNotification == undefined || user.data().pushNotification){
                console.log("Sending push notification");
                await showNotification(userToken, subject, message);
            }
        }

       manageReminderType(reminder, userId);
       if(reminder.data().type != "DEFAULT"){
            deleteReminder(userId,reminderId);
       }
    });
});

function manageReminderType(reminder, userId){
switch(reminder.data().type){
    case "SPECIAL":
        handleSpecialReminder(reminder, userId);
        break;
    case "CYCLICAL":
        handleCyclicalReminder(reminder, userId);
        break;
    default:
        return 0;
}
}

function handleSpecialReminder(reminder, userId){
var newDate = reminder.data().date.toDate();
newDate = findNextWeekday(newDate, reminder.data().weekDays);
addReminder(userId, reminder, newDate).catch((e) => console.log(e));
}

function findNextWeekday(currentDate, weekDays){
const days = new Array('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun');
console.log("Date now:" + currentDate);
currentDate.setDate(currentDate.getDate() + 1);
console.log("Date after setting:" + currentDate);
console.log("Searching for next day: ");
for(var i = 0; i<7; i++){
    console.log(days[currentDate.getDay()] + " == " + weekDays);
        if(weekDays.includes(days[currentDate.getDay()])){
            return currentDate;
        }
    currentDate.setDate(currentDate.getDate() + 1);
}
throw("findNextWeekday");
}

function handleCyclicalReminder(reminder, userId){
    switch(reminder.data().frequency){
        case "everyDay":
            var newDate = reminder.data().date.toDate();
            newDate.setDate(newDate.getDate() + 1);
            addReminder(userId, reminder, newDate).catch(() => 
                    console.log('handleCyclicalReminder exception'));
            break;
        case "everyWeek":
            var newDate = reminder.data().date.toDate();
            newDate.setDate(newDate.getDate() + 7);
            addReminder(userId, reminder, newDate).catch(() => 
                    console.log('handleCyclicalReminder exception'));
            break;
        case "everyMonth":
            var newDate = reminder.data().date.toDate();
            newDate.setDate(newDate.getMonth() + 1);
            addReminder(userId, reminder, newDate).catch(() => 
                    console.log('handleCyclicalReminder exception'));
            break;
        case "everyYear":
            var newDate = reminder.data().date.toDate();
            newDate.setDate(newDate.getFullYear() + 1);
            addReminder(userId, reminder, newDate).catch(() => 
                    console.log('handleCyclicalReminder exception'));
            break;
        default:
            throw("handleCyclicalReminder");
    }
}

function addReminder(userId, reminder, date){
    //date.setDate(date.getSeconds);
    console.log("Adding new reminder");
    console.log("New reminder time: " + date);
    return new Promise((resolve,reject) => admin
				.firestore()
				.collection('Users')
				.doc(userId)
				.collection('Reminders')
				.add({
					text      : reminder.data().text,
					date      : date,
					frequency : reminder.data().frequency,
					weekDays  : reminder.data().weekDays,
					type      : reminder.data().type
				})
				.then(() => resolve())
                .catch((e) => reject(e))
    );
}

function deleteReminder(userId,reminderId){
console.log("Deleting reminder");
admin.firestore().collection('Users').doc(userId)
    .collection('Reminders').doc(reminderId).delete()
}

function showNotification(token, title, message) {
    console.log("Showing psuh notification");
    var payload = {
        notification: {
            title: title,
            body: message
        }
    };
    return admin.messaging().sendToDevice(token, payload);
}

function sendMail(destination, subject, msg, res) {
    console.log("Sending email, parameters:");
    console.log('destination: ',destination);
    console.log('subject: ',subject);
    console.log('msg: ',msg);
    // getting dest email by query string
    const dest = destination;
    const title = subject;
    const message = msg;

    const mailOptions = {
        from: 'Memohelper <reminder@memohelper.com>',
        to: dest,
        subject: title, // email subject
        html: `<p style="font-size: 16px;">${message}</p>
               <br />
               <img src="https://regiodom.pl/portal/sites/regiodom/files/imagecache/755x/images/regiodompl/5/niezapominajki-kwiatki-z-bajki.jpg?p8rcjw" />
           ` // email content in HTML
    };
    
    // returning result
    return transporter.sendMail(mailOptions, (erro, info) => {
        if (erro) {
            console.log('Sending email failed');
            console.log(erro.toString());
            return res.send(erro.toString());
        }
        console.log('Sending email succeed!');
        return res.send('Sended email');
    });


}

exports.removeUser = functions.auth.user().onDelete(user => {
    admin.firestore().collection('Users').doc(user.uid).delete();
});