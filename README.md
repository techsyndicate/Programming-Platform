# Programming-Platform
In-house, Platform Built For Hosting Programming Events, With Various Features.

### Please Look At .test.env, Explanation of various secrets below.

```
SECRET = Cookie Secret
MONGO_USER = Mongo Atlas User
MONGO_PASSWORD = Mongo Atlas User Password (must have admin/owner equivalent)
MONGO_CLUSTER_URL = Mongo Atlas DB cluster Url
MONGO_DATABASE_NAME = Mongo Atlas DB Database Name
SERVER_AUTH_STRING = A Randomly Generated String, must be placed in env of instance of <https://github.com/techsyndicate/Programming-Platform-backend-vm>
SERVER_BACKEND_VM = Ip Of Instance Of <https://github.com/techsyndicate/Programming-Platform-backend-vm>
DISCORD_CLIENT_ID = <https://discord.com/developers/applications> New Application->Oauth2
DISCORD_CLIENT_SECRET = <https://discord.com/developers/applications> New Application->Oauth2
DISCORD_REDIRECT_URI = Discord Redirect URI For Callback, i.e <your-domain>/discord-back/callback
DISCORD_REDIRECT_URI_LOGIN = Discord Redirect URI for Login Callback, in the frontend. (we send a post request to backend, from the frontend so that cookies can be set easily)
GMAIL_EMAIL = Your Gmail Adress For NodeMailer To Use
GMAIL_PASSWORD = Gmail App Password <https://support.google.com/accounts/answer/185833?hl=en>
DISCORD_WEBHOOKS_CRASH_REPORT = Webhook For Crash Reporting
DISCORD_WEBHOOKS_WEB_VITALS = Webhook For Web Vitals
DISCORD_WEBHOOKS_CODE_EXEC_VITALS = Webhook for Code Exec Vitals
FRONT_END_URL = Instance of the /react-app
```

<b> In various places in the code, the domain may be baked into the application. Search for it in VSC is recommended </b>

### Services Used
1. Azure Load Balancer|Traffic Manager -> Manage Traffic between multiple servers in various regions. 
2. Azure VM B1s/Aws t1.micro EC2 -> Virtual Machine (750 free hours), i.e instance of [Programming-Platform-backend-vm](https://github.com/techsyndicate/Programming-Platform-backend-vm) with pre-installed, GCC,GPP,mono-devel,python3,python2
3. ~~Twilo Sendgrid -> Sending Emails~~
4. Discord Oauth2.0
5. Passport Js LocalAuth
6. MongoDB -> Storing Data (alternatives azure cosmos DB, google firebase, DynamoDB [Not Natively Supported, But should be easy to migrate.])
7. Heroku To Deploy FrontEnd's Backend App the NodeJS, (can use azure or AWS for this too)
8. ~~Azure AD B2C~~ 
9. NodeMailer
10. Netlify to host ReactJS frontend.

### Run Application
After Setting in Various Strings as needed in .env, run the following commands to get your app up and running.
```
npm install
npm build
npm run dev (to run in development)
npm start (to run in production etc.)
```

## Admin Panel Explained
##### /admin
1. Lists All Various Features Available In The Pannel. This is Subject To Change as Needed. 
##### /admin/practise
1. Makes A New Practise Section. For example, if you enter Python, it will Make
<b>/Practise/Python</b> (ID For Any Use is currently Hackily Either Obtained Through MongoDB directly or Can Be obtained Through Logs In the HTML Page)

##### /admin/event
1. Makes A New Event On The Website, With Start Time And End Time. (ID For Any Use is currently Hackily Either Obtained Through MongoDB directly or Can Be obtained Through Logs In the HTML Page).

##### /admin/question
1. The  Question Form, Adds A Question in the practice or the event id submitted. (To Get The quesid, to add test cases or whatever, use the console or MongoDB directly. [Hacky Will Fix, ~~likely/probably not~~](https://www.youtube.com/watch?v=3LtQWxhqjqI))

##### /admin/question/testcase
1. Adds A TestCase To The Question belonging to the quesid submitted.
##### /admin/user/all
1. Lists All User With All Their Details. If Discord Is Linked, shows button to open it and Has A button to ban users.
##### /admin/user/ban
1. Redirects to /admin/user/ban/:id, id is the given quesid
##### /admin/user/ban/:id
1. Confirm Ban User Associated with given id

## We provide no API. Use of any of our services as an API is a violation of our terms and services. And will result in an immediate ban. 

## Client App Explained
1. Moved To ReactApp, i.e [react-app](https://github.com/techsyndicate/Programming-Platform/tree/main/react-app)

<h3> If you Face Any Issue While Deploying Your Own Version Of Our App, Please Feel Free To Start A Issue.</h3>



# Contributors
1. [@gamer-1478](https://aayushgarg.net)