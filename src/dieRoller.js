const axios = require('axios');

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

const singleRoll = (max) => Math.floor((Math.random() * max) + 1);

const dieRoller = (max, username, dices = 1) => {
    let rolled = 0;
    for (let i = 0; i < dices; i++) {
        rolled += singleRoll(max)
    }
    return {
        response_type: "in_channel",
        text: `${username} rolled a ${rolled} from ${dices}d${max}`
    };
};

const delayedResponse = async (responseUrl, data) => {
    await axios({
        method: 'post',
        url: responseUrl,
        data
    });
};

exports.dndDieRngBuilder = async (req, res, max) => {
    const query = req.body.text;
    const username = req.body.user_name;
    const responseUrl = req.body.response_url;
    let rolledData;
    if (query === 'help') {
        return res.send(diceRollerHelpText(max, username));
    }
    if (isNaN(query) && query !== 'help') {
        return res.send(dieRollerError(max, username));
    }
    rolledData = dieRoller(max, username, query ? parseInt(query) : 1);
    return await delayedResponse(responseUrl, rolledData)
};