# Programming-Platform
In-house, Platform Built For Hosting Programming Events, With Various Features.

### Please Look At .test.env, Explanation of various secrets given below.

```
SECRET = Cookie Secret
MONGO_USER = Mongo Atlas User
MONGO_PASSWORD = Mongo Atlas User Password (must have admin/owner equivalent)
MONGO_CLUSTER_URL = Mongo Atlas DB cluster Url
MONGO_DATABASE_NAME = Mongo Atlas DB Database Name
SERVER_AUTH_STRING = A Randomly Generated String, must be placed in env of instance of [Programming-Platform-backend-vm](https://github.com/techsyndicate/Programming-Platform-backend-vm)
SERVER_BACKEND_VM = Ip Of Instance Of [Programming-Platform-backend-vm](https://github.com/techsyndicate/Programming-Platform-backend-vm)
DISCORD_CLIENT_ID = <https://discord.com/developers/applications> New Application->Oauth2
DISCORD_CLIENT_SECRET = <https://discord.com/developers/applications> New Application->Oauth2
DISCORD_REDIRECT_URI = Discord Redirect URI For Callback, i.e <your-domain>/discord-back/callback
GMAIL_EMAIL = Your Gmail Adress For NodeMailer To Use
GMAIL_PASSWORD = Gmail App Password <https://support.google.com/accounts/answer/185833?hl=en>
```

##### In Various Places the String ts-prog.herokuapp.com may be baked into the applcation, Search for it in vsc is recommended

### Services Used
1. Azure Load Balancer|Traffic Manager -> Manage Traffic between out multiple servers in various regions. 
2. Azure VM B1s -> Virtual Machine (750 free hours), i.e instance of [Programming-Platform-backend-vm](https://github.com/techsyndicate/Programming-Platform-backend-vm) with pre installed, gcc,gpp,mono-devel,python3,python2
3. ~~Twilo Sendgrid -> Sending Emails ~~
4. Discord Oauth2.0
5. Passport Js LocalAuth
6. MongoDB -> Storing Data

### Contributors
1. [@gamer-1478](https://aayushgarg.net)
