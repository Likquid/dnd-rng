const express = require('express');
const axios = require('axios');
const _ = require('lodash');

const app = express();
const { characterContext } = require('./src/characterGenerator');
const { dndDieRngBuilder, singleRoll } = require('./src/dieRoller');
const { PLAYERS } = require('./src/constants');

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

app.post('/4', async (req, res) => dndDieRngBuilder(req, res, 4));

app.post('/6', async (req, res) => dndDieRngBuilder(req, res, 6));

app.post('/8', async (req, res) => dndDieRngBuilder(req, res, 8));

app.post('/10', async (req, res) => dndDieRngBuilder(req, res, 10));

app.post('/12', async (req, res) => dndDieRngBuilder(req, res, 12));

app.post('/20', async (req, res) => dndDieRngBuilder(req, res, 20));

app.post('/100', async (req, res) => dndDieRngBuilder(req, res, 100));

app.post('/initiative', async (req, res) => {
    let initiative = [];
    let roll;
    _.each(PLAYERS, (player) => {
        roll = singleRoll(20);
        const rolledPlayer = {
            name: player.name,
            modifier: player.modifier,
            roll,
        };
        initiative.push(rolledPlayer);
    });

    let sortedInitiative = _.orderBy(initiative, ['roll'], ['desc']);

    let initiativeString = '';
    _.each(sortedInitiative, (player) => {
        initiativeString += `${player.name} ${player.roll + player.modifier} (${player.roll} + ${player.modifier})\n`;
    });

    let data = {
        response_type: "in_channel",
        text: `Initiative order:\n${initiativeString}`
    };

    return await axios({
        method: 'post',
        url: req.body.response_url,
        data
    });
});

app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});