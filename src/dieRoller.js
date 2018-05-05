const diceRollerHelpText = (max) => {
    return {
        response_type: "in_channel",
        "attachments": [ { "text": `Default behaviour of /${max} rolls 1d${max}. If you wish to roll multiple e.g. 2d${max} type in /${max} 2, only accepts numbers as the first argument.`} ]
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

exports.dndDieRngBuilder = (req, res, max) => {
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