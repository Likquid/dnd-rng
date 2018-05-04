const express = require('express');
const axios = require('axios');

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 8080));

app.get('/', (req, res) => {
    return res.send('Running');
});

app.post('/generate', async (req, res) => {
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

    const characterContext = `
    Name: ${data.description.name}
    Age: ${data.description.age}
    Gender: ${data.description.gender}
    Race: ${data.description.race}
    Occupation: ${data.description.occupation}`;

    const body = {
        response_type: "in_channel",
        "attachments": [ { "text": characterContext } ]
    };
    return res.send(body);
});

app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});