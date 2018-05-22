const axios = require('axios');
const { delayedResponse } = require('./util/slackResponse');

const contentHelpText = () => {
    return {
        response_type: 'ephemeral',
        text: `Default behaviour of /info <DND_CONTENT>'. It should return a link for the thing you're looking for if it exists.`
    }
};

const contentNotFoundText = (query) => {
    return {
        response_type: 'ephemeral',
        text: `Something went wrong... Can't find the content you were looking for: ${query}`
    }
};

const contentLink = (query) => {
    return {
        response_type: 'ephemeral',
        attachments: [
            {
                pretext: `*Here's a link to what you're looking for:*`,
                title: query,
                title_link: `https://roll20.net/compendium/dnd5e/${encodeURIComponent(query)}`
            }
        ]
    }
};

const fetchContent = async (query) => {
    try {
        return await axios({
            method: 'get',
            url: `https://roll20.net/compendium/dnd5e/${encodeURIComponent(query)}`,
            responseType: 'document'
        });
    } catch (err) {
        return err.response;
    }
};

exports.contentFetcher = async (req, res) => {
    const query = req.body.text;
    const responseUrl = req.body.response_url;
    if (query === 'help' || query === '') {
        const helpText = contentHelpText();
        res.status(200).send();
        return await delayedResponse(responseUrl, helpText);
    }
    const content = await fetchContent(query);
    if (content.status !== 200) {
        const notFoundText = contentNotFoundText(query);
        res.status(200).send();
        return await delayedResponse(responseUrl, notFoundText);
    } else {
        const link = contentLink(query);
        res.status(200).send();
        return await delayedResponse(responseUrl, link);
    }
};