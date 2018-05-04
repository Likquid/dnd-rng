const express = require('express');
const axios = require('axios');

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 8080));

const characterContext = (data) =>
`Name: ${data.description.name}
Age: ${data.description.age}
Gender: ${data.description.gender}
Race: ${data.description.race}
Occupation: ${data.description.occupation}`;

app.get('/', (req, res) => {
    return res.send('Running');
});

app.post('/generate', async (req, res) => {
    const URL = `http://npcgenerator.azurewebsites.net/_/npc?classorprof=0`;
    const response = await axios({
        method: 'get',
        url: URL,
        response: 'json'
    });

    const data = response.data;

    console.log(data.description);

    const character = characterContext(data);

    const body = {
        response_type: "in_channel",
        "attachments": [ { "text": character } ]
    };
    return res.send(body);
});

app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});