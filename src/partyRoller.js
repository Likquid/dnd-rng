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
    },
    {
        name: 'Will',
        modifier: 3,
    }
];

// TODO: clean up logic
const uniqueRoll = (modifier, initiativeArr) => {
    const roll = singleRoll(20);
    const rollCollision = _.find(initiativeArr, player => (player.rollModifier === (roll + modifier)));
    if (rollCollision) {
        return uniqueRoll(modifier, initiativeArr);
    }
    return { roll, rollModifier: roll + modifier };
};

exports.initiative = async (responseUrl, res) => {
    let initiative = [];
    let initiativeString = '';
    _.each(PLAYERS, player => {
        const { roll, rollModifier } = uniqueRoll(player.modifier, initiative);
        const rolledPlayer = {
            name: player.name,
            modifier: player.modifier,
            roll,
            rollModifier
        };
        initiative.push(rolledPlayer);
    });
    let sortedInitiative = _.orderBy(initiative, ['rollModifier'], ['desc']);
    _.each(sortedInitiative, (player, index) => {
        initiativeString += `*${index + 1}.* ${player.name}  *(${player.rollModifier})*  _(${player.roll} + ${player.modifier})_\n`;
    });
    let data = {
        response_type: "in_channel",
        text: `*Initiative Order:*\n${initiativeString}`
    };
    res.status(200).send();
    return await delayedResponse(responseUrl, data);
};

exports.loot = async (responseUrl, res) => {
    let loot = [];
    let roll = 0;
    let lootString = '';
    _.each(PLAYERS, (player) => {
        roll = singleRoll(20);
        const rolledPlayer = {
            name: player.name,
            roll,
        };
        loot.push(rolledPlayer);
    });
    let sortedLootRoll = _.orderBy(loot, ['roll'], ['desc']);
    _.each(sortedLootRoll, (player, index) => {
        if (index === 0) {
            lootString = `*${index + 1}.* ${player.name}  *(${player.roll})*  :money_mouth_face: :money_mouth_face: :money_mouth_face:\n`;
        } else if (index === sortedLootRoll.length - 1) {
            lootString += `*${index + 1}.* ${player.name}  *(${player.roll})*  :poop:\n`;
        } else {
            lootString += `*${index + 1}.* ${player.name}  *(${player.roll})*\n`;
        }
    });
    let data = {
        response_type: "in_channel",
        text: `*Loot Order:*\n${lootString}`
    };
    res.status(200).send();
    return await delayedResponse(responseUrl, data);
};
