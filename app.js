const express = require('express');
const app = express();
const url = require('url');
const request = require('request');

const format = ".json";
const APIKEY = process.env.WU_ACCESS;

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 8080));

app.get('/', (req, res) => {
    res.send('Running');
});

//app.post is triggered when a POST request is sent to the URL ‘/post’
app.post('/post', (req, res)=> {
    //take a message from Slack slash command
    const query = req.body.text;

    const parsed_url = url.format({
        pathname: 'http://api.wunderground.com/api/' + APIKEY + '/conditions/q/' + query + format,
    });

    request(parsed_url,  (err, response, body) => {
        if (!err && response.statusCode === 200) {
            const data = JSON.parse(body);
            const temperature = data.current_observation.temperature_string;
            const weatherCondition = data.current_observation.weather;
            const icon_url = data.current_observation.icon_url;
            const location = data.current_observation.display_location.full;
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
            res.send(body);
        }
    });
});

app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});