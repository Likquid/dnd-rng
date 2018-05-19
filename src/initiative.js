const _ = require('lodash');
const { singleRoll } = require('./dieRoller');
const { delayedResponse } = require('./util/slackResponse');

const PLAYERS = [
    {
        name: 'Billy',
        modifier: 0,
    },
    {
        name: 'Emily',
        modifier: 0,
    },
    {
        name: 'Tony',
        modifier: 0,
    },
    {
        name: 'Abel',
        modifier: 0,
    },
    {
        name: 'Beixi',
        modifier: 0,
    },
    {
        name: 'Brandon',
        modifier: 0,
    },
    {
        name: 'John',
        modifier: 0,
    }
];

exports.rollInitiative = async (responseUrl) => {
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
    return await delayedResponse(responseUrl, data);
};