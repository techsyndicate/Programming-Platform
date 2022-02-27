const Axios = require("axios");

function validateEmail(email) {
    const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

async function getDiscordUser(access_token) {
    return await Axios({
        url: `https://discord.com/api/users/@me`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    }).then((res_dis) => {
        return res_dis.data;
    }).catch((err) => {
        return err;
    });
}


module.exports = { validateEmail, getDiscordUser }