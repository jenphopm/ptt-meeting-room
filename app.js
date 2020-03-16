const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const axios = require('axios');
const moment = require('moment');

app.use(bodyParser.json())

app.set('port', (process.env.PORT || 4000))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// "User Jane Ue50b2d654ce343c18bd995156b863dee"
// "Group PTT Meeting Room C02fb59d54276c128aa3d93acab7708d9"

app.post('/webhook', (req, res) => {
    let text = req.body.events[0].message.text
    let sender = req.body.events[0].source.userId
    let group = req.body.events[0].source.groupId
    let replyToken = req.body.events[0].replyToken
    // console.log(text, sender, group, replyToken)
    // console.log(typeof sender, typeof text)
    // console.log("req.body.events[0]", req.body.events[0])
    // console.log(req.body.events[0])
    // if (text === 'สวัสดี' || text === 'Hello' || text === 'hello') {
    //     sendMessage(sender, text)
    // }
    res.sendStatus(200)
})

app.get('/sendRoomNumber', (req, res) => {
    let sender = "C02fb59d54276c128aa3d93acab7708d9"
    let today = moment().format('DD-MMM-YY');
    // console.log("today", today)
    // let message = "test"
    axios.get('https://script.google.com/macros/s/AKfycbz0XswpatxtNryRGk6Y-AVKfv_T3TE1AuMbyzEbQNCPvSi2AQc/exec', {
        params: {
            path: '/room/' + today
        }
    })
        .then(function (response) {
            console.log("response", response.data);
            if (!response.data.error) {
                let message = "To Day: " + today + "\nRoom No: " + response.data.roomNo + "\nPIN Code: " + response.data.pin
                sendMessage(sender, message)
            } else {
                let message = "To Day: " + today + "\nไม่พบข้อมูลของวันนี้"
                sendMessage(sender, message)
            }
        })
        .catch(function (error) {
            console.log(error);
        })
    res.sendStatus(200)
})

function sendMessage(sender, message) {
    let data = {
        to: sender,
        messages: [
            {
                type: 'text',
                text: message
            }
        ]
    }
    request({
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer {VLk1/JCveuzY6bRzVaj6eKBb3m2XXUciihGfp/V6AfP59+2UqmzBErNp88EaaFNmMZT0plnSW5ce3Gbss7HGh6bOK6wEFW/1jNRZx168Nz97SMQvLo4fvJm6bjbCc0HQnmVCH79IkpwJKjEUsxLMXAdB04t89/1O/w1cDnyilFU=}'
        },
        url: 'https://api.line.me/v2/bot/message/push',
        method: 'POST',
        body: data,
        json: true
    }, function (err, res, body) {
        if (err) console.log('error')
        if (res) console.log('success')
        if (body) console.log(body)
    })
}

app.listen(app.get('port'), function () {
    console.log('run at port', app.get('port'))
})