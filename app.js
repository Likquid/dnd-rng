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
Occupation: ${data.description.occupation}

Ability Scores:
Str: ${data.abilities.str}
Dex: ${data.abilities.dex}
Con: ${data.abilities.con}
Int: ${data.abilities.int}
Wis: ${data.abilities.wis}
Cha: ${data.abilities.cha}

Alignment:
Chaotic: ${data.alignment.chaotic}
Neutral: ${data.alignment.ethicalneutral}
Evil: ${data.alignment.evil}
Good: ${data.alignment.good}
Lawful: ${data.alignment.Lawful}

Relationships:
Sexual Orientation: ${data.relationship.orientation}
Status: ${data.relationship.status}

Traits:
${data.ptraits.traits1}
${data.ptraits.traits2}
${data.pquirks.description}
${data.religion.description}

Plot Hook: ${data.hook.description}
`;

const diceRollerHelpText = (max) => {
    return {
        response_type: "in_channel",
        "attachments": [ { "text": `Default behaviour of /${max} rolls 1d${max}. If you wish to roll multiple e.g. 2d${max} tpye in /${max} 2, only accepts numbers are the second argument.`} ]
    }
};

const singleRoll = (max) => Math.floor((Math.random() * max) + 1);

const dieRoller = (max, dices) => {
    if (dices) {
        let rolled = 0;
        for (let i = 0; i < dices; i++) {
            rolled += singleRoll(max)
        }
        return {
            response_type: "in_channel",
            "attachments": [ { "text": `You rolled a ${rolled}` } ]
        };
    }
    return {
        response_type: "in_channel",
        "attachments": [ { "text": `You rolled a ${singleRoll(max)}` } ]
    };
};

const dieRollerError = (max) => {
    return {
        response_type: "in_channel",
        "attachments": [ { "text": `You've got to put in number... If you want some help type in /${max} help` } ]
    };
};

const dndDieRngBuilder = (req, res, max) => {
    if (!req.body.text) {
        return res.send(dieRoller(max));
    }
    const query = req.body.text;
    if (query === 'help') {
        return res.send(diceRollerHelpText(max));
    }
    if (isNaN(query) && query !== 'help') {
        return res.send(dieRollerError(max));
    }
    return res.send(dieRoller(max, parseInt(query)));
};

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

app.post('/6', async (req, res) => {
    return res.send(dieRoller(6));
});

app.post('/8', async (req, res) => {
    return res.send(dieRoller(8));
});

app.post('/10', async (req, res) => {
    return res.send(dieRoller(10));
});

app.post('/12', async (req, res) => {
    return res.send(dieRoller(12));
});

app.post('/20', async (req, res) => {
    return res.send(dieRoller(20));
});

app.post('/100', async (req, res) => {
    return res.send(dieRoller(100));
});

app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});