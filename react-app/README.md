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
1. Profile page, and has various features such as link discord, verify email, And Logout.

##### /Practice, /Events
1. Shows All The Events or Practise Categories Available Respectively. 

##### /Practice/:id, /Events/:id
1. Shows All The Problems in the given practise or event, event has other checks such as verified profile, logged in etc.

##### /Question/:id/:subpart
1. Goes to the given question, Has Run Code, Submit Code, And a Code Editor and other features. 
2. There are 2 subparts that are Problem, and Submissions, i.e problem shows the problem while submissions show all the submissions the user has made.

##### /Events/:id/:subpart
1. Event's ``questions`` subpart shows all the questions while the ``leaderboard`` subpart shows All Users that are Actively Participating. *Note:- LeaderBoard Doesn't Update After Event Ends.

## We Provide No API, Continued Use Of Any of Our Services as an API is a violation of our terms and services and can, rather will result in a immediate ban. 