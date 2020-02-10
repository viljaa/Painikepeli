# Painikepeli
Painikepeli is a real-time full-stack button multiplayer game, developed by utilizing React in the front-end, Express.js and socket.io in the back-end and my very own brains for multiple lines of own code and logic. Painikepeli was developed as an entry to Koodarijahti 2020 organized by Vincit. In a nutshell, the idea of the game is to gain as many points as possible within the 3 minutes by pressing a button.

## Deployment<br>
Painikepeli is deployed at: https://vj-painikepeli.herokuapp.com/

Feel free to test out the game alone or with some friends, any feedback is greatly appreciated!

## Running the app locally

Clone the repository and run ```npm install``` on both **root**, and **painikepeli-client** directory to install dependencies. After that, start the back-end server by running ```npm start``` on the root directory.<br><br>

The front-end client is developed using React, and is located in the **painikepeli-client** directory. To start the client run<br> ```npm start``` in the **painikepeli-client** directory. In order for the app to work properly locally and connect the client to the backend, the user has to reconfigure endpoint in **root\painikepeli-client\src\components\Game\Game.js** as:<br><br>```const endpoint = 'localhost:4000' ```<br><br>
More information about scripts avaliable for React client in the painikepeli-client readme.md.<br><br>
Finally, open http://localhost:3000 in your browser to use the app.
