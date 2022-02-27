// Import Modules
const express = require('express'),
    discord_router = express.Router();

const Axios = require('axios');
const userSchema = require('../schema/userSchema');
const { checkAuthenticated } = require('../utilities/passportReuse');
const { getDiscordUser } = require('../utilities/misc');

var scopes = ['identify', 'email', 'guilds', 'guilds.join', 'guilds.members.read', 'gdm.join'];
var prompt = 'none';

discord_router.get('/auth', checkAuthenticated, (req, res) => {
    // Redirect To Discord OAuth2
    // https://discord.com/developers/docs/topics/oauth2#authorization-code-grant

    res.redirect(`https://discord.com/api/oauth2/authorize?response_type=code&client_id=${process.env.DISCORD_CLIENT_ID}&scope=${encodeURI(scopes.join(' '))}&redirect_uri=${process.env.DISCORD_REDIRECT_URI}&prompt=${prompt}`);
});

discord_router.get('/callback', checkAuthenticated, async (req, res, next) => {
    // Callback url to get the access token, refresh token to get the new access token
    // https://discord.com/developers/docs/topics/oauth2#authorization-code-grant-redirect-url-example

    try {
        await Axios({
            url: `https://discord.com/api/oauth2/token`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: `client_id=${process.env.DISCORD_CLIENT_ID}&client_secret=${process.env.DISCORD_CLIENT_SECRET}&grant_type=authorization_code&code=${req.query.code}&redirect_uri=${process.env.DISCORD_REDIRECT_URI}`
        }).then(async (res_dis) => {
            userSchema.findById(req.user.id).then(async (user) => {
                user.discord = res_dis.data;
                user.discordUser = await getDiscordUser(res_dis.data.access_token)
                user.save().then(() => {
                    res.redirect('/Profile');
                });
            });
        })
    } catch (err) {
        res.send(err.message);
    }

});

discord_router.get('/current-user', checkAuthenticated, async (req, res, next) => {
    // get current user from discord, header(Authorization = Bearer <token>)
    // https://discord.com/api/users/@me
    // https://discord.com/developers/docs/game-sdk/users#getcurrentuser

    res.send(await getDiscordUser(req.user.discord.access_token));

})

module.exports = discord_router;