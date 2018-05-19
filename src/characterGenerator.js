const { delayedResponse } = require('./util/slackResponse');
const axios = require('axios');

exports.characterContext = (data) =>
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

exports.generateCharacter = async (responseUrl, res) => {
    const response = await axios({
        method: 'get',
        url: 'http://npcgenerator.azurewebsites.net/_/npc?classorprof=0',
        response: 'json'
    });
    const data = response.data;
    const character = exports.characterContext(data);
    const body = {
        response_type: "in_channel",
        "attachments": [ { "text": character } ]
    };
    res.status(200).send();
    return await delayedResponse(responseUrl, body);
};