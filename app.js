const express = require('express');
const axios = require('axios');

const app = express();
const { characterContext } = require('./src/characterGenerator');
const { dndDieRngBuilder } = require('./src/dieRoller');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 8080));

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
    const character = characterContext(data);
    const body = {
        response_type: "in_channel",
        "attachments": [ { "text": character } ]
    };
    return res.send(body);
});

app.post('/4', async (req, res) => {
    if (req.body) {
        await axios({
            method: 'post',
            url: req.body.request_url,
            data: {
                response_type: "in_channel",
                text: `test message`
            }
        });
    }
    console.log('Should have returned message');
    // dndDieRngBuilder(req, res, 4)
});

app.post('/6', async (req, res) => dndDieRngBuilder(req, res, 6));

app.post('/8', async (req, res) => dndDieRngBuilder(req, res, 8));

app.post('/10', async (req, res) => dndDieRngBuilder(req, res, 10));

app.post('/12', async (req, res) => dndDieRngBuilder(req, res, 12));

app.post('/20', async (req, res) => dndDieRngBuilder(req, res, 20));

app.post('/100', async (req, res) => dndDieRngBuilder(req, res, 100));

app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});