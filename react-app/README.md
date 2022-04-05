# Programming-Platform-client-app
To UnderStand How To Start A development Server Read [CreateReactApp.md](https://github.com/techsyndicate/Programming-Platform/blob/main/react-app/CreateReactApp.md)

But Really, ``¯\_(ツ)_/¯``, it's as simple as
```
npm install
npm start
```

## Client App Explanation
##### /Login, /Register
1. Login, Register Pages

##### /Profile
1. Profile page has various features such as link discord, verify email, And Logout.

##### /Profile/:id
1. Shows the profile page of the user with the given id. It is case sensitive that is aayush and Aayush are 2 different IDs.


##### /Practice, /Events
1. Shows All The Events or Practise Categories Available Respectively. 

##### /Practice/:id, /Events/:id
1. Shows All The Problems in the given practice or event. Event has other checks such as verified profile, logged in etc.

##### /Question/:id/:subpart
1. Goes to the given question, Has Run Code, Submit Code, And a Code Editor and other features. 
2. 2 subparts are Problem and Submissions. The problem shows the problem. Submissions show all the submissions the user has made.

##### /Events/:id/:subpart
1. Event's ``questions`` subpart shows all the questions. The ``leaderboard`` subpart shows All Users that are Actively Participating.
Leaderboard gives the first preference to points, second to time! LB Is automatically locked after the event ends. Test cases are automatically made public too!

## We provide no API. Use of any of our services as an API is a violation of our terms and services. And will result in an immediate ban. 