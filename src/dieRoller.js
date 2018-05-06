const diceRollerHelpText = (max) => {
    return {
        response_type: "ephemeral",
        "attachments": [ { "text": `Default behaviour of /${max} rolls 1d${max}. If you wish to roll multiple e.g. 2d${max} type in /${max} 2, only accepts numbers as the first argument.`} ]
    }
};

const singleRoll = (max) => Math.floor((Math.random() * max) + 1);

const dieRoller = (max, username, dices = 1) => {
    let rolled = 0;
    for (let i = 0; i < dices; i++) {
        rolled += singleRoll(max)
    }
    return {
        response_type: "in_channel",
        "attachments": [ { "text": `${username} rolled a ${rolled} from ${dices}d${max}` } ]
    };
};

const dieRollerError = (max) => {
    return {
        response_type: "ephemeral",
        "attachments": [ { "text": `You've got to put in number... If you want some help type in /${max} help` } ]
    };
};

exports.dndDieRngBuilder = (req, res, max) => {
    const username = req.body.user_name;
    if (!req.body.text) {
        return res.send(dieRoller(max, username));
    }
    const query = req.body.text;
    if (query === 'help') {
        return res.send(diceRollerHelpText(max, username));
    }
    if (isNaN(query) && query !== 'help') {
        return res.send(dieRollerError(max, username));
    }
    return res.send(dieRoller(max, username, parseInt(query)));
};