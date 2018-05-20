const _ = require('lodash');
const { singleRoll } = require('./dieRoller');
const { delayedResponse } = require('./util/slackResponse');

const PLAYERS = [
    {
        name: 'Billy',
        modifier: -1,
    },
    {
        name: 'Emily',
        modifier: 3,
    },
    {
        name: 'Tony',
        modifier: -1,
    },
    {
        name: 'Abel',
        modifier: 2,
    },
    {
        name: 'Beixi',
        modifier: -1,
    },
    {
        name: 'Brandon',
        modifier: 1,
    },
    {
        name: 'John',
        modifier: 1,
    }
];

exports.rollInitiative = async (responseUrl, res) => {
    let initiative = [];
    let roll = 0;
    let initiativeString = '';
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
    _.each(sortedInitiative, (player) => {
        initiativeString += `${player.name} ${player.roll + player.modifier} (${player.roll} + ${player.modifier})\n`;
    });
    let data = {
        response_type: "in_channel",
        text: `Initiative order:\n${initiativeString}`
    };
    res.status(200).send();
    return await delayedResponse(responseUrl, data);
};