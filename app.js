const express = require('express');
const app = express();
const { generateCharacter } = require('./src/characterGenerator');
const { dndDieRngBuilder } = require('./src/dieRoller');
const { rollInitiative } = require('./src/initiative');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 8080));

app.get('/', (req, res) => res.send('Running'));

app.post('/generate', async (req, res) => generateCharacter(req.body.response_url, res));

app.post('/initiative', async (req, res) => rollInitiative(req.body.response_url, res));

app.post('/4', async (req, res) => dndDieRngBuilder(req, res, 4));

app.post('/6', async (req, res) => dndDieRngBuilder(req, res, 6));

app.post('/8', async (req, res) => dndDieRngBuilder(req, res, 8));

app.post('/10', async (req, res) => dndDieRngBuilder(req,  res,10));

app.post('/12', async (req, res) => dndDieRngBuilder(req,  res,12));

app.post('/20', async (req, res) => dndDieRngBuilder(req,  res,20));

app.post('/100', async (req, res) => dndDieRngBuilder(req, res, 100));

app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});