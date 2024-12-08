Milestone 04 - Final Project Documentation
===

### NetID
---
kb4242

### Name
---
Kwaaku Boamah-Powers

### Repository Link
---
[GitHub Repository](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-iLinx007)

### URL for deployed site
---
[Gamer's Grimoire](http://linserv1.cims.nyu.edu:12170/)







### URL for Form 1
---
[Registration form](http://linserv1.cims.nyu.edu:12170/register)

### URL for Form 1 Result
---
After registering and logging in, the username appears at the top right corner along with the avatar <br>
- [Home Page](http://linserv1.cims.nyu.edu:12170/)

### URL for Form 2
---
[Add Game Form](http://linserv1.cims.nyu.edu:12170/addgame)

### Special Instructions for Form 2
---
User must be logged in to be able to add a game

### URL for Form 2 Result
---
After adding a game, the game will be listed under games created by the user and on the home page which displays all games <br>
- [Home Page](http://linserv1.cims.nyu.edu:12170/)
- [User profile](http://linserv1.cims.nyu.edu:12170/profile)

<!-- ### URL for Form 3
---
[Update Profile Form](http://linserv1.cims.nyu.edu:12165/update-profile)

### Special Instructions for Form 3
---
User must be logged in to be able to update profile

### URL for Form 3 Result
---
After updating user profile, the changes can be seen from the user's profile page<br>
- [Profile](http://linserv1.cims.nyu.edu:12165/profile) -->

-- ### First link to github line number(s) for constructor, HOF, etc.
---
- [map](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-iLinx007/blob/master/client/src/components/UserProfile.jsx)

### Second link to github line number(s) for constructor, HOF, etc.
---
- [filter](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-iLinx007/blob/master/server/routes/gameRoutes.mjs)

### Short description for links above
---
The *map* method is used to iterate over the user's game list and generate GameCard components for each game.
The *filter* is used in the UserProfile component to update the local state by removing a game from the user's game list after deletion.

### Link to github line number(s) for schemas (db.js or models folder)
---
- [schemas](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-iLinx007/tree/master/server/models)

### Description of research topics above with points
---
- *5 points* - User Authentication and Authorization: Implementing *Passport.js* for secure login and registration, hashed passwords, sessions, and authorization for user-only routes.  
- *3 points* - API Testing with Postman: Testing API endpoints (e.g., user authentication, game uploads) using *Postman*, with screenshots and API documentation.  
- *6 points* - React Frontend Framework: Building the frontend with *React*, managing state, and creating dynamic, responsive user interfaces for snippets and collaboration.  
- *2 points* - Use a CSS Framework (Tailwind CSS): Applying *Tailwind CSS* for rapid styling and customization to match SoundSync's design.  
- *5 points* - Build Tools and Task Runners (Vite/ESLint Integration): Using *Vite* for bundling and file watching, integrated with *ESLint* for automated code linting with a dedicated configuration file.

### Links to github line number(s) for research topics described above (one link per line)
---
- [Passport](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-iLinx007/blob/master/server/app.mjs)
- [React & Tailwindcss](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-iLinx007/tree/master/client/src)
- [Postman](https://www.postman.com/spaceflight-astronaut-65513481/game-routes/overview)
- [Postman](https://www.postman.com/spaceflight-astronaut-65513481/user-auth/overview)
- [Vite & Eslint](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-iLinx007/blob/master/client/vite.config.js)
  <!-- - ![eslint](documentation/vite.gif =100x) -->
  - [configuration file](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-iLinx007/blob/master/client/vite.config.js)
  - [eslint file](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-iLinx007/blob/master/client/eslint.config.js)
  - <img src="documentation/vite.gif" width="600"/> -->