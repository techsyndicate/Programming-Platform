// Import Modules
const express = require('express'),
    discord_router = express.Router(),
    Axios = require('axios');

// Import Files
const userSchema = require('../schema/userSchema'),
    { checkAuthenticated } = require('../utilities/passportReuse'),
    { getDiscordUser, refreshDiscordToken } = require('../utilities/misc');

// Vars
var scopes = ['identify', 'email', 'guilds', 'guilds.join', 'guilds.members.read', 'gdm.join'];
var prompt = 'none';

// discord auth
discord_router.get('/auth', checkAuthenticated, (req, res) => {
    if (req.user.discord.access_token) {
        res.redirect('/profile');
    } else {
        // Redirect To Discord OAuth2
        // https://discord.com/developers/docs/topics/oauth2#authorization-code-grant
        res.redirect(`https://discord.com/api/oauth2/authorize?response_type=code&client_id=${process.env.DISCORD_CLIENT_ID}&scope=${encodeURI(scopes.join(' '))}&redirect_uri=${process.env.DISCORD_REDIRECT_URI}&prompt=${prompt}`);
    }
});

// discord auth callback
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
                res_dis.data.ISSUED_AT = new Date().toString();
                user.discord = res_dis.data;
                user.discordUser = await getDiscordUser(res_dis.data.access_token)
                userSchema.find({ 'discordUser.email': user.discordUser.email }).then(async (user_dis) => {
                    if (user_dis.length > 0) {
                        res.render('error', { error: "This Discord Account Is Already Linked With Another Account On Our Platform At The Moment!!", redirect: '/profile' });
                    } else {
                        user.discordUser.ISSUED_AT = new Date().toString();
                        user.save().then(() => {
                            res.redirect('/Profile');
                        });
                    }
                });
            });
        })
    } catch (err) {
        res.render('error', { error: "This Discord Code Is Expired Or Invalid, Please Retry Auth!!!", redirect: '/profile' });
    }

});

// update current user's discord data
discord_router.get('/current-user', checkAuthenticated, async (req, res, next) => {
    // get current user from discord, header(Authorization = Bearer <token>)
    // https://discord.com/api/users/@me
    // https://discord.com/developers/docs/game-sdk/users#getcurrentuser

    if (req.user.discord.access_token) {
        var data = await getDiscordUser(req.user.discord.access_token);
        if (data.toJSON) {
            data = JSON.parse(JSON.stringify(data.toJSON()))
        }
        if (data.status && data.status == 401) {
            // refresh token
            var refresh_token = req.user.discord.refresh_token;
            var refresh_data = await refreshDiscordToken(refresh_token);
            userSchema.findById(req.user.id).then(async (user) => {
                refresh_data.ISSUED_AT = new Date().toString();
                user.discord = refresh_data;
                user.discordUser = await getDiscordUser(refresh_data.access_token)
                user.discordUser.ISSUED_AT = new Date().toString();
                user.save().then(() => {
                    res.send(user.discordUser);
                });
            });
        }
        else {
            userSchema.findById(req.user.id).then(async (user) => {
                user.discordUser = data;
                user.discordUser.ISSUED_AT = new Date().toString();
                user.save().then(() => {
                    res.send(data);
                });
            });
        }
    } else {
        res.send({ success: false });
    }
})

// discord user avatar
discord_router.get('/avatar', checkAuthenticated, (req, res, next) => {
    // get avatar from discord
    // cdn.discordapp.com/avatars/<user_id>/<avatar_hash>.<extension>
    // https://discord.com/developers/docs/reference#image-formatting

    if (req.user.discord.access_token) {
        if (Math.abs(new Date() - req.user.discordUser.ISSUED_AT) > 3600000) {
            // refresh token
            var refresh_token = req.user.discord.refresh_token;
            var refresh_data = refreshDiscordToken(refresh_token);
            userSchema.findById(req.user.id).then(async (user) => {
                refresh_data.ISSUED_AT = new Date().toString();
                user.discord = refresh_data;
                user.discordUser = await getDiscordUser(refresh_data.access_token)
                user.discordUser.ISSUED_AT = new Date().toString();
                user.save().then(() => {
                    res.redirect('https://cdn.discordapp.com/avatars/' + user.discordUser.id + '/' + user.discordUser.avatar + '.png?size=1024&quality=lossless');
                });
            });
        } else {
            res.redirect('https://cdn.discordapp.com/avatars/' + req.user.discordUser.id + '/' + req.user.discordUser.avatar + '.png?size=1024&quality=lossless');
        }
    } else {
        res.redirect('/images/defaultdis.png');
    }
})

module.exports = discord_router;