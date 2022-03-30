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

async function refreshDiscordToken(refresh_token) {
    return await Axios({
        url: `https://discord.com/api/oauth2/token`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: `client_id=${process.env.DISCORD_CLIENT_ID}&client_secret=${process.env.DISCORD_CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${refresh_token}`
    }).then((res_dis) => {
        return res_dis.data;
    }).catch((err) => {
        return err;
    });
}

async function ReportWebVital(content) {
    Axios({
        url: process.env.DISCORD_WEBHOOKS_WEB_VITALS,
        method: 'POST',
        data: { content }
    })
}

async function ReportCrash(content) {
    Axios({
        url: process.env.DISCORD_WEBHOOKS_CRASH_REPORT,
        method: 'POST',
        data: { content }
    }).then((res) => { }).catch((err) => {
        console.log(err);
    });
}

async function ReportCodeExec(content) {
    Axios({
        url: process.env.DISCORD_WEBHOOKS_CODE_EXEC_VITALS,
        method: 'POST',
        data: { content }
    }).then((res) => { }).catch((err) => {
        console.log(err);
    });
}

async function CheckServerHealth(url) {
    return await Axios({
        url: url,
        method: 'GET',
        timeout: 5000
    }).then((res) => {
        return res;
    }).catch((err) => {
        return { err: err, sucess: false, msg: 'Server is down' };
    });
}

module.exports = { CheckServerHealth, ReportCodeExec, ReportWebVital, ReportCrash, validateEmail, getDiscordUser, refreshDiscordToken }