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