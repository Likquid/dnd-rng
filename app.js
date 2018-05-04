const express = require('express');
const app = express();
const axios = require('axios');
const APIKEY = process.env.WU_ACCESS;

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 8080));

app.get('/', (req, res) => {
    return res.send('Running');
});

app.post('/generateCharacter', async (req, res) => {
    const raceIndex = Math.floor((Math.random() * 19) + 1);
    const genderIndex = Math.round(Math.random());
    const alignmentIndex = Math.floor((Math.random() * 2) + 1);

    const URL = `http://npcgenerator.azurewebsites.net/_/npc?race=${raceIndex}&gender=${genderIndex}&alignment=${alignmentIndex}`;

    const response = await axios({
        method: 'get',
        url: URL,
        response: 'json'
    });

    const data = response.data;

    console.log(data.description);

    const body = {
        response_type: "in_channel",
        "attachments": [
            {
                "text": "Name: " + data.description.name + "\n"
                + "Age: " + data.description.age + "\n"
                + "Gender: " + data.description.gender + "\n"
                + "Race: " + data.description.race + "\n"
                + "Occupation: " + data.description.occupation
            }
        ]
    };
    return res.send(body);
});

//app.post is triggered when a POST request is sent to the URL ‘/post’
app.post('/post', async (req, res)=> {
    //take a message from Slack slash command
    const query = req.body.text;

    const URL = `http://api.wunderground.com/api/${APIKEY}/conditions/q/${query}.json`;

    const response = await axios({
        method: 'get',
        url: URL,
        response: 'json'
    });

    const temperature = response.data.current_observation.temperature_string;
    const weatherCondition = response.data.current_observation.weather;
    const icon_url = response.data.current_observation.icon_url;
    const location = response.data.current_observation.display_location.full;

    const body = {
        response_type: "in_channel",
        "attachments": [
            {
                "text": "Location: " + location + "\n"
                + "Temperature: " + temperature + "\n"
                + "Condition: " + weatherCondition,
                "image_url": icon_url,
            }
        ]
    };
    return res.send(body);
});

app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});