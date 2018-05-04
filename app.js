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