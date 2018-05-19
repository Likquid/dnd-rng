const axios = require('axios');

exports.delayedResponse = async (responseUrl, data) => {
    await axios({
        method: 'post',
        url: responseUrl,
        data
    });
};