const { delayedResponse } = require('./util/slackResponse');

const diceRollerHelpText = (max) => {
    return {
        response_type: "ephemeral",
        text: `Default behaviour of /${max} rolls 1d${max}. If you wish to roll multiple e.g. 2d${max} type in /${max} 2, only accepts numbers as the first argument.`
    }
};

const dieRollerError = (max) => {
    return {
        response_type: "ephemeral",
        text: `You've got to put in number... If you want some help type in /${max} help`
    };
};

exports.singleRoll = (max) => Math.floor((Math.random() * max) + 1);

const dieRoller = (max, username, dices = 1) => {
    let rolled = 0;
    for (let i = 0; i < dices; i++) {
        rolled += exports.singleRoll(max)
    }
    return {
        response_type: "in_channel",
        text: `${username} rolled a ${rolled} from ${dices}d${max}`
    };
};

exports.dndDieRngBuilder = async (req, res, max) => {
    const query = req.body.text;
    const username = req.body.user_name;
    const responseUrl = req.body.response_url;
    let rolledData;
    if (query === 'help') {
        const helpText = diceRollerHelpText(max);
        res.status(200).send();
        return await delayedResponse(responseUrl, helpText);
    }
    if (isNaN(query) && query !== 'help') {
        const errorText = dieRollerError(max);
        res.status(200).send();
        return await delayedResponse(responseUrl, errorText);
    }
    rolledData = dieRoller(max, username, query ? parseInt(query) : 1);
    res.status(200).send();
    return await delayedResponse(responseUrl, rolledData);
};